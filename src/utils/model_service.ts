import { QueryBuilder } from "knex";
import { Column, db, Table, TableType } from "../config/database";
import reshape from "../utils/reshape";

type Join<T extends Table = Table> = {
  table: T;
  columns: Column<T>[];
  pk: Column<T>;
  joins?: Join[];
  through?: Table;
  prefix?: string;
};

function addJoin(query: QueryBuilder, from: Join, to: Join) {
  let columns: string[];
  if (to.through) {
    query = query.leftJoin(
      to.through,
      to.through + "." + from.pk,
      from.table + "." + from.pk
    );
    const [q, c] = addJoin(
      query,
      {
        table: to.through,
        pk: to.pk,
        columns: [],
      },
      { ...to, through: undefined, prefix: (to.prefix || to.table) + "[]." }
    );
    query = q;
    columns = c;
  } else {
    query = query.leftJoin(
      to.table,
      to.table + "." + to.pk,
      from.table + "." + to.pk
    );
    columns = to.columns.map(
      (e) => to.table + "." + e + (to.prefix ? " as " + to.prefix + e : "")
    );
  }
  if (to.joins) {
    for (const i of to.joins) {
      const [q, c] = addJoin(query, to, i);
      if (to.prefix) {
        columns = columns.concat(c.map((e) => " as " + to.prefix + e));
      } else columns = columns.concat(c);
      query = q;
    }
  }
  return [query, columns] as const;
}
export class ModelService<
  T extends Table,
  PKType extends number | string = number
> implements Join<T>
{
  table: T;
  pk: Column<T>;
  columns: Column<T>[];
  joins: Join[];

  constructor(
    table: T,
    pk: Column<T> = table.replace(/s?$/, "_id") as Column<T>,
    columns: Column<T>[] = [pk]
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
  select() {
    let query = db(this.table);
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
  selectPublic() {
    return this.select();
  }
  async list({ offset = 0, limit = 100 }) {
    console.log(
      this.selectPublic()
        //   .where("status", "published")
        .limit(parseInt(limit.toString()) || 0)
        .offset(parseInt(offset.toString()) || 0)
        .toSQL()
    );
    return reshape(
      await this.selectPublic()
        //   .where("status", "published")
        .limit(parseInt(limit.toString()) || 0)
        .offset(parseInt(offset.toString()) || 0)
    ) as TableType<T>[];
  }
  async retrieve(id: PKType) {
    const data = await this.selectPublic()
      // .where("status", "published")
      .where(this.table + "." + this.pk, id);
    if (!data || !data.length) {
      return null;
    } else {
      return reshape(data)[0] as TableType<T>;
    }
  }
  async create(data: Partial<TableType<T>>) {
    const id = (await db(this.table).insert(data).returning(this.pk))[0][
      this.pk
    ];
    return id as PKType;
  }
  async update(id: PKType, data: Partial<TableType<T>>) {
    return this.selectPublic()
      .where({ [this.pk]: id })
      .update({
        ...data,
      });
  }
  async delete(id: PKType) {
    return this.selectPublic()
      .where({ [this.pk]: id })
      .delete();
  }
}
