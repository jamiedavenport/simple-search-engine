import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const indexTokens = sqliteTable(
  "index_tokens",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    token: text().notNull(),
    weight: integer().notNull(),
  },
  (t) => [unique().on(t.token, t.weight)]
);

export const indexEntries = sqliteTable(
  "index_entries",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    documentType: text().notNull(),
    documentId: integer().notNull(),
    tokenId: integer()
      .notNull()
      .references(() => indexTokens.id),
    fieldId: text().notNull(),
    weight: integer().notNull(),
  },
  (t) => [
    index("idx_document_type_document_id").on(t.documentType, t.documentId),
    index("idx_token_id").on(t.tokenId),
    index("idx_document_type_field_id").on(t.documentType, t.fieldId),
    index("idx_weight").on(t.weight),
  ]
);
