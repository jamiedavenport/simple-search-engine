import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export const db = drizzle("file:./db.sqlite", {
  schema,
});

export { schema };
export * from "drizzle-orm";
