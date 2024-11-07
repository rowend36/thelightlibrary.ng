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
  item_id,
  tags,
  update,
  through = (from.slice(0, -1) + "_" + to) as JoinTable,
  from_pk = (from.slice(0, -1) + "_id") as Column<From>,
  to_pk = (to.slice(0, -1) + "_id") as Column<To>,
}: {
  trx: Knex.Transaction;
  item_id: number;
  tags: Partial<TableType<To>>[];
  from: From;
  to: To;
  update?: boolean;
  through?: JoinTable;
  from_pk?: Column<From>;
  to_pk?: Column<To>;
}) {
  if (tags.length) {
    const new_tags = tags.filter((tag) => ((tag[to_pk] as number) ?? 0) <= 0);
    let mapped_tags: TableType<To>[] = [];
    if (new_tags.length) {
      console.log("Uploading tags....");
      mapped_tags = (await trx<TableType<To>>(to)
        .insert(
          new_tags.map((e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [to_pk]: _, ...x } = e;
            return x;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .returning(to_pk)) as any;
    }
    console.log("Updating post tags....");
    if (update) {
      await trx(through)
        .where(from_pk, item_id)
        .whereNotIn(
          // @ts-expect-error - GO figure
          to_pk,
          tags.map((tag) => tag[to_pk])
        )
        .delete();
    }
    let m = trx(through).insert(
      tags
        .filter((e) => ((e[to_pk] as number) ?? 0) > 0)
        .concat(mapped_tags)
        .map((tag) => ({
          [from_pk]: item_id,
          [to_pk]: tag[to_pk],
        }))
    );
    if (update) {
      m = m.onConflict().ignore();
    }
    await m;
  }
}
