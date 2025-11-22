import { expect, test } from "bun:test";
import { NgramParser, PrefixParser, WordParser } from "./search";

test("NgramParser", () => {
  expect(new NgramParser().parse("parser")).toMatchInlineSnapshot(`
    [
      "par",
      "ars",
      "rse",
      "ser",
    ]
  `);
});

test("PrefixParser", () => {
  expect(new PrefixParser().parse("parser")).toMatchInlineSnapshot(`
    [
      "pars",
      "parse",
      "parser",
    ]
  `);
});

test("WordParser", () => {
  expect(new WordParser().parse("   Hello, world!    ")).toMatchInlineSnapshot(`
    [
      "hello",
      "world",
    ]
  `);
});
