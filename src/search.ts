import { and, db, eq, schema, inArray, desc } from "./db";

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
  private parsers = [new WordParser(), new NgramParser(), new PrefixParser()];

  private async upsertToken(token: string, weight: number) {
    const found = await db.query.indexTokens.findFirst({
      where: eq(schema.indexTokens.token, token),
    });

    if (found) {
      return found;
    }

    const [created] = await db
      .insert(schema.indexTokens)
      .values({ token, weight })
      .onConflictDoNothing({
        target: [schema.indexTokens.token, schema.indexTokens.weight],
      })
      .returning();

    if (!created) {
      throw new Error(`Failed to upsert token: ${token}`);
    }

    return created;
  }

  async index(document: Document) {
    await db
      .delete(schema.indexEntries)
      .where(eq(schema.indexEntries.documentId, document.getDocumentId()));

    for (const [fieldId, value, fieldWeight] of document.getIndexableFields()) {
      for (const parser of this.parsers) {
        const tokens = parser.parse(value);
        for (const token of tokens) {
          const indexToken = await this.upsertToken(token, parser.weight);

          await db.insert(schema.indexEntries).values({
            documentId: document.getDocumentId(),
            documentType: document.getDocumentType(),
            tokenId: indexToken.id,
            fieldId,
            weight:
              Math.ceil(Math.sqrt(token.length)) * parser.weight * fieldWeight,
          });
        }
      }
    }
  }

  async search(documentType: string, query: string, limit = 25) {
    const tokens = Array.from(
      new Set(
        this.parsers
          .flatMap((parser) => parser.parse(query))
          .sort((a, b) => b.length - a.length)
      )
    );

    const results = await db
      .selectDistinct({
        documentType: schema.indexEntries.documentType,
        documentId: schema.indexEntries.documentId,
        token: schema.indexTokens.token,
        weight: schema.indexTokens.weight,
      })
      .from(schema.indexEntries)
      .innerJoin(
        schema.indexTokens,
        eq(schema.indexEntries.tokenId, schema.indexTokens.id)
      )
      .where(
        and(
          eq(schema.indexEntries.documentType, documentType),
          inArray(schema.indexTokens.token, tokens)
        )
      )
      .orderBy(desc(schema.indexTokens.weight))
      .limit(limit);

    const uniqueMap = new Map<
      string,
      { documentId: number; documentType: string }
    >();
    for (const row of results) {
      const key = `${row.documentType}:${row.documentId}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          documentId: row.documentId,
          documentType: row.documentType,
        });
      }
    }
    return Array.from(uniqueMap.values());
  }
}
