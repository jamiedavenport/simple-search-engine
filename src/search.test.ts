import { expect, test } from "bun:test";
import { NgramTokenizer, PrefixTokenizer, WordTokenizer } from "./search";

test("NgramTokenizer", () => {
  expect(new NgramTokenizer().tokenize("parser")).toMatchInlineSnapshot(`
    [
      "par",
      "ars",
      "rse",
      "ser",
    ]
  `);
});

test("PrefixTokenizer", () => {
  expect(new PrefixTokenizer().tokenize("parser")).toMatchInlineSnapshot(`
    [
      "pars",
      "parse",
      "parser",
    ]
  `);
});

test("WordTokenizer", () => {
  expect(new WordTokenizer().tokenize("   Hello, world!    "))
    .toMatchInlineSnapshot(`
    [
      "hello",
      "world",
    ]
  `);
});
