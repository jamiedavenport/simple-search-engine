import type { Document, Field } from "./indexer/document";

export class Post implements Document {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly content: string
  ) {}
  getDocumentId(): number {
    return this.id;
  }

  getDocumentType(): string {
    return "post";
  }

  getIndexableFields(): Field[] {
    return [
      ["title", this.title, 10],
      ["content", this.content, 1],
    ];
  }
}
