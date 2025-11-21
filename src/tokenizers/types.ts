export type Tokenizer = {
  tokenize: (text: string) => string[];
  getWeight: () => number;
};
