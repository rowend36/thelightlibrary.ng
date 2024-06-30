import { program } from "commander";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
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
});
if (import.meta.url === `file://${process.argv[1]}`) {
  // Your code here, this block will only execute if this module is the entry point
  program.parse(process.argv);
}
