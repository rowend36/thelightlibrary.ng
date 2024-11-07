import { Knex } from "knex";
import { getDatabase } from "../config/database";
import reshape from "./reshape";

export async function search<T extends object>(
  query: string,
  tsvector: string,
  select: ReturnType<Knex<T>["select"]>,
  offset: number,
  limit: number,
  searchSpace = 100, // Initial search space, defaults to 100 rows
) {
  const db = getDatabase();
  // Preprocess the query by removing unwanted characters and preparing it for to_tsquery
  const preprocessed =
    "(" +
    query
      .replace(/[^-_'\w ]/g, "") // Remove non-alphanumeric characters except dashes and underscores
      .split(" ") // Split the query into words
      .filter(Boolean) // Filter out empty words
      .map((e) => e + ":*") // Append ':*' to each word for prefix matching in tsquery
      .join(")|(") + // Combine the words with logical OR operator for tsquery
    ")";

  let result: T[] = [];

  // Construct the base subquery for the full-text search
  let subquery = select
    .select(
      db.raw(
        `ts_rank(${tsvector}, to_tsquery(?)) AS rank`, // Calculate rank based on the tsvector and query
        [preprocessed], // Use preprocessed query for ts_rank
      ),
    )
    .whereRaw(`${tsvector} @@ to_tsquery(?)`, [preprocessed]); // Use the tsvector to filter results

  // Loop to increase search space if the result is not sufficient
  while (searchSpace <= 400) {
    // Cap the search space expansion to 400
    let mainQuery: any;

    if (searchSpace < 400) {
      // Limit the rows processed in subquery if searchSpace is less than 400
      subquery = subquery.limit(searchSpace).as("subQuery");
      mainQuery = db
        .select("*")
        .from(subquery) // Use the subquery as the source for the main query
        .orderBy("rank", "desc") // Order by rank in descending order
        .offset(offset) // Apply offset for pagination
        .limit(limit); // Limit the result to the specified 'limit'
    } else {
      // If searchSpace is 400 or more, rely on PostgreSQL query planner without limiting subquery rows
      mainQuery = subquery.orderBy("rank", "desc").offset(offset).limit(limit);
    }

    result = await mainQuery; // Execute the query and store the result

    // If enough results are found, reshape and return them
    if (result.length >= limit) {
      return reshape<any, T>(result); // Reshape the result to the desired format
    }

    // If results are insufficient, double the search space for the next iteration
    searchSpace *= 2;
  }

  // Return whatever results were found, even if less than the limit
  return result;
}
