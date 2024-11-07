import { Knex, QueryBuilder } from "knex";
import { Column, getDatabase, Table, TableType } from "../config/database";
import reshape from "./reshape";

type Join<T extends Table = Table> = {
  table: T;
  columns: Column<T>[];
  pk: Column<T>;
  joins?: Join[];
  through?: Table;
  prefix?: string;
};

function addJoin(query: Knex.QueryBuilder, from: Join, to: Join) {
  let columns: string[];
  if (to.through) {
    query = query.leftJoin(
      to.through,
      from.table + "." + from.pk,
      to.through + "." + from.pk,
    );
    const [q, c] = addJoin(
      query,
      {
        table: to.through,
        pk: to.pk,
        prefix: from.prefix,
        columns: [],
      },
      { ...to, through: undefined, prefix: (to.prefix || to.table) + "[]" },
    );
    query = q;
    columns = c;
  } else {
    query = query.leftJoin(
      to.table,
      from.table + "." + to.pk,
      to.table + "." + to.pk,
    );
    const prefix =
      (from.prefix ? from.prefix + "." : "") +
      (to.prefix ? to.prefix + "." : "");
    columns = to.columns.map(
      (e) => to.table + "." + e + (prefix ? " as " + prefix + e : ""),
    );

    if (to.joins) {
      for (const i of to.joins) {
        const [q, c] = addJoin(query, to, i);
        columns = columns.concat(c);
        query = q;
      }
    }
  }
  return [query, columns] as const;
}
export class ModelRepository<
  T extends Table,
  PKType extends number | string = number,
> implements Join<T>
{
  table: T;
  pk: Column<T>;
  columns: Column<T>[];
  joins: Join[];

  constructor(
    table: T,
    pk: Column<T> = table.replace(/s?$/, "_id") as Column<T>,
    columns: Column<T>[] = [pk],
  ) {
    this.table = table;
    this.pk = pk;
    this.columns = columns;
    this.joins = [];
  }

  hasOne<T extends Table>(join: Omit<Join<T>, "through">) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.joins.push(join as any);
    return this;
  }
  hasMany<T extends Table>(join: Join<T> & Required<Pick<Join<T>, "through">>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.joins.push(join as any);
    return this;
  }
  filter(
    query: Knex.QueryBuilder,
  ): Knex.QueryBuilder<TableType<T>, TableType<T>[]> {
    let columns = this.columns.map((e) => this.table + "." + e);
    for (const i of this.joins) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [q, c] = addJoin(query, this as any, i);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = q as any;
      columns = columns.concat(c);
    }
    return query.select(columns);
  }
  select(
    txn: Knex.Transaction = getDatabase() as never,
  ): Knex.QueryBuilder<TableType<T>, TableType<T>[]> {
    return this.filter(txn(this.table));
  }
  async list({ offset = 0, limit = 100 }) {
    console.log(
      this.select()
        //   .where("status", "published")
        .limit(parseInt(limit.toString()) || 0)
        .offset(parseInt(offset.toString()) || 0)
        .toSQL(),
    );
    return reshape(
      await this.select()
        //   .where("status", "published")
        .limit(parseInt(limit.toString()) || 0)
        .offset(parseInt(offset.toString()) || 0),
    ) as TableType<T>[];
  }
  async retrieve(id: PKType) {
    const data = await this.select()
      // .where("status", "published")
      .where(this.table + "." + this.pk, id);
    if (!data || !data.length) {
      return null;
    } else {
      return reshape(data)[0] as TableType<T>;
    }
  }
  async create(data: Partial<TableType<T>>) {
    const db = getDatabase();
    const id = (await db(this.table).insert(data).returning(this.pk))[0][
      this.pk
    ];
    return id as PKType;
  }
  async update(id: PKType, data: Partial<TableType<T>>) {
    return this.select()
      .where({ [this.pk]: id })
      .update(data as never);
  }
  async delete(id: PKType) {
    return this.select()
      .where({ [this.pk]: id })
      .delete();
  }
}
