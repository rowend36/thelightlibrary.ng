// We can't import this file in Edge Functions
import * as dotenv from "dotenv";
if ((process.env.NODE_ENV ?? "development") === "development") {
  dotenv.config({
    path: ".env.development",
  });
  dotenv.config({
    path: ".env.development.local",
  });
} else {
  dotenv.config({
    path: ".env.production.local",
  });
}
