import { expect, test } from "bun:test";
import { WordTokenizer } from "./word";

test("WordTokenizer", () => {
  expect(WordTokenizer.tokenize("   Hello, world!    ")).toMatchInlineSnapshot(`
    [
      "hello",
      "world",
    ]
  `);
});
