import type { Tokenizer } from "./types";

export const WordTokenizer: Tokenizer = {
  tokenize: (text: string) => {
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
  },
  getWeight: () => 20,
};
