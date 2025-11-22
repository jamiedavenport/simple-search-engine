import { db, eq, schema } from "./db";

interface Parser {
  readonly weight: number;

  parse: (text: string) => string[];
}

export class WordParser implements Parser {
  readonly weight = 20;

  parse(text: string) {
    return Array.from(
      new Set(
        text
          .trim()
          .toLocaleLowerCase()
          .replace(/[^a-z0-9]/g, " ")
          .replace(/\s+/g, " ")
          .split(" ")
          .filter((token) => token.length >= 2)
      )
    );
  }
}

const NGRAM_LENGTH = 3;

export class NgramParser implements Parser {
  readonly weight = 1;

  parse(text: string) {
    const words = new WordParser().parse(text);

    return Array.from(
      new Set(
        words
          .map((word) =>
            Array.from({ length: word.length - NGRAM_LENGTH + 1 }, (_, i) =>
              word.slice(i, i + NGRAM_LENGTH)
            )
          )
          .flat()
      )
    );
  }
}

const MIN_PREFIX_LENGTH = 4;

export class PrefixParser implements Parser {
  readonly weight = 5;

  parse(text: string) {
    const words = new WordParser().parse(text);

    return Array.from(
      new Set(
        words
          .map((word) =>
            Array.from(
              { length: word.length - MIN_PREFIX_LENGTH + 1 },
              (_, i) => word.slice(0, MIN_PREFIX_LENGTH + i)
            )
          )
          .flat()
      )
    );
  }
}

export type Field = [string, string, number]; // [name, value, weight]

export type Document = {
  getDocumentId(): number;
  getDocumentType(): string;
  getIndexableFields(): Field[];
};

export class SearchEngine {
  private tokenizers = [
    new WordParser(),
    new NgramParser(),
    new PrefixParser(),
  ];

  private upsertToken(token: string, weight: number) {
    return db
      .insert(schema.indexTokens)
      .values({ token, weight })
      .onConflictDoNothing({
        target: [schema.indexTokens.token, schema.indexTokens.weight],
      })
      .returning();
  }

  async index(document: Document) {
    await db
      .delete(schema.indexEntries)
      .where(eq(schema.indexEntries.documentId, document.getDocumentId()));
  }

  search(documentType: string, query: string, limit = 25) {}
}
