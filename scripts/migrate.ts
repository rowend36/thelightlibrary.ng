import fs from "fs";
import path from "path";
import { migrationsDir } from "./create_migration";
import { db } from "../src/config/database";
import { PostgresError } from "pg-error-enum";
import indexToPosition from "index-to-position";

class Migration {
  name!: string;
}

fs.readdir(migrationsDir, async (err, migrations) => {
  migrations.sort();

  let applied: string[] = [];
  try {
    const results = await db<Migration>("migrations").select("*");
    applied = results.map((r) => r.name);
  } catch (e: any) {
    if (e.code === PostgresError.UNDEFINED_TABLE) {
      console.log("First run");
    } else {
      console.log(e);
      return;
    }
  }

  const pending = migrations.filter((m) => !applied.includes(m));
  if (pending.length === 0) {
    console.log("No pending migrations");
    return;
  }
  for (const m of pending) {
    if (!/[0-9]+_[a-z_A-Z]+/.test(m)) {
      throw new Error(`Invalid migration name: ${m}`);
    }
    console.log(`Applying migration: ${m}`);
    const content = `START TRANSACTION;${fs.readFileSync(
      path.join(migrationsDir, m),
      "utf-8"
    )}
INSERT INTO migrations (name) VALUES ('${m}');
COMMIT;`;
    try {
      await db.raw(content);
    } catch (e: any) {
      if (e.position !== undefined) {
        let pos = indexToPosition(content, Number(e.position), {
          oneBased: true,
        });
        throw new Error(
          "Error in migration: " +
            m +
            " at line: " +
            pos.line +
            " column: " +
            pos.column +
            ":\n" +
            e.message
        );
      }
      throw e;
    }
  }
});
