import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

type Tokenizer =
  | "WordTokenizer"
  | "PrefixTokenizer"
  | "NgramTokenizer"
  | "SingularTokenizer";

export const indexTokens = sqliteTable(
  "index_tokens",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    token: text().notNull(),
    weight: integer().notNull(),
  },
  (t) => [unique().on(t.token, t.weight)]
);

export const indexEntries = sqliteTable("index_entries", {
  id: integer().primaryKey(),
  // todo
});
