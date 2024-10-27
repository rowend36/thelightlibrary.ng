import { program } from "commander";
import * as path from "node:path";
import * as fs from "node:fs";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../.env.production.local"
      : "../.env.local"
  ),
});

export const migrationsDir = path.join(__dirname, "../src/data/migrations");
program.argument("<name>", "migration name").action(async (name) => {
  fs.writeFileSync(
    path.join(migrationsDir, `${Date.now()}_${name}.sql`),
    "// Write your migration here"
  );
  console.log("Migration created successfully");
});
if (__filename === process.argv[1]) {
  // Your code here, this block will only execute if this module is the entry point
  program.parse(process.argv);
} else console.log(__filename, process.argv);
