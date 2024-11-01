import { Knex } from "knex";
import { Column, Table, TableType } from "../config/database";

export async function createRelations<
  From extends Table,
  To extends Table,
  JoinTable extends Table
>({
  from,
  to,
  trx,
  id,
  tags,
  join_table = (from.slice(0, -1) + "_" + to.slice(0, -1)) as JoinTable,
  post_id = (from.slice(0, -1) + "_id") as Column<From>,
  tag_id = (to.slice(0, -1) + "_id") as Column<To>,
}: {
  trx: Knex.Transaction;
  id: Column<From>;
  tags: Partial<TableType<To>>[];
  from: From;
  to: To;
  join_table?: JoinTable;
  post_id?: Column<From>;
  tag_id?: Column<To>;
}) {
  if (tags.length) {
    const new_tags = tags.filter((tag) => ((tag[tag_id] as number) ?? 0) <= 0);
    let mapped_tags: TableType<To>[] = [];
    if (new_tags.length) {
      console.log("Uploading tags....");
      mapped_tags = (await trx<TableType<To>>(to)
        .insert(
          new_tags.map((e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [tag_id]: _, ...x } = e;
            return x;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .returning(tag_id)) as any;
    }
    console.log("Updating post tags....");
    await trx(join_table).insert(
      tags
        .filter((e) => ((e[tag_id] as number) ?? 0) > 0)
        .concat(mapped_tags)
        .map((tag) => ({
          [post_id]: id,
          tag_id: tag[tag_id],
        }))
    );
  }
}
