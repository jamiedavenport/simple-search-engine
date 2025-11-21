// interface IndexableDocumentInterface
// {
//     public function getDocumentId(): int;
//     public function getDocumentType(): DocumentType;
//     public function getIndexableFields(): IndexableFields;
// }

export type Field = [string, string, number]; // [name, value, weight]

export type Document = {
  getDocumentId(): number;
  getDocumentType(): string;
  getIndexableFields(): Field[];
};
