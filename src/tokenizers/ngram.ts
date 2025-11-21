import type { Tokenizer } from "./types";
import { WordTokenizer } from "./word";

const NGRAM_LENGTH = 3;

export const NgramTokenizer: Tokenizer = {
  tokenize: (text: string) => {
    const words = WordTokenizer.tokenize(text);

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
  },
  getWeight: () => 1,
};
