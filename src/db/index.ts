import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export const db = drizzle("file:./db.sqlite", {
  schema,
});

export { schema };
