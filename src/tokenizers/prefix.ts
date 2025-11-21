import type { Tokenizer } from "./types";
import { WordTokenizer } from "./word";

const MIN_PREFIX_LENGTH = 4;

export const PrefixTokenizer: Tokenizer = {
  tokenize: (text: string) => {
    const words = WordTokenizer.tokenize(text);

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
  },
  getWeight: () => 5,
};
