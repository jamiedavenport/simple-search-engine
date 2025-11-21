import { expect, test } from "bun:test";
import { PrefixTokenizer } from "./prefix";

test("PrefixTokenizer", () => {
  expect(PrefixTokenizer.tokenize("parser")).toMatchInlineSnapshot(`
    [
      "pars",
      "parse",
      "parser",
    ]
  `);
});
