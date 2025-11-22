interface Tokenizer {
  readonly weight: number;

  tokenize: (text: string) => string[];
}

export class WordTokenizer implements Tokenizer {
  readonly weight = 20;

  tokenize(text: string) {
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

export class NgramTokenizer implements Tokenizer {
  readonly weight = 1;

  tokenize(text: string) {
    const words = new WordTokenizer().tokenize(text);

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

export class PrefixTokenizer implements Tokenizer {
  readonly weight = 5;

  tokenize(text: string) {
    const words = new WordTokenizer().tokenize(text);

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
