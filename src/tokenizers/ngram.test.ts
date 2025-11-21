import { expect, test } from "bun:test";
import { NgramTokenizer } from "./ngram";

test("NgramTokenizer", () => {
  expect(NgramTokenizer.tokenize("parser")).toMatchInlineSnapshot(`
    [
      "par",
      "ars",
      "rse",
      "ser",
    ]
  `);
});
