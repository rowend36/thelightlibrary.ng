import * as fs from "fs";
import * as path from "path";
import { migrationsDir } from "./create_migration";
import { db } from "../src/config/database";
import { PostgresError } from "pg-error-enum";

class Migration {
  name!: string;
}
import("index-to-position").then(({ default: indexToPosition }) => {
  fs.readdir(migrationsDir, async (err: any, migrations: string[]) => {
    migrations.sort(
      (e, f) => parseInt(e.split("_")[0]) - parseInt(f.split("_")[0]),
    );

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
    console.log({ applied, pending });
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
        "utf-8",
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
              e.message,
          );
        }
        throw e;
      }
    }
    console.log("Done. Press Ctrl-C to exit");
  });
});
