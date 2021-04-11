import Calculator from '../index.js';
import assert from 'assert/strict';
import mpWasm from 'mp-wasm';

const calc = new Calculator(mpWasm);
calc.mpf.setDefaultPrec(128);

const tests = [
  {
    name: "Number test",
    expr: " 2 ",
    tree: [
      `1:2-1:3 number 2 "2"`,
    ].join('\n'),
  },
  {
    name: "Nested parentheses test",
    expr: "((2))",
    tree: [
      `1:1-1:6 paren "((2))"`,
      `  1:2-1:5 paren "(2)"`,
      `    1:3-1:4 number 2 "2"`,
    ].join('\n'),
  },
  {
    name: "Prefix + test",
    expr: "+1",
    tree: [
      `1:1-1:3 prefixOp add "+1"`,
      `  1:2-1:3 number 1 "1"`,
    ].join('\n'),
  },
  {
    name: "Prefix + with space test",
    expr: "+ 1",
    tree: [
      `1:1-1:4 prefixOp add "+ 1"`,
      `  1:3-1:4 number 1 "1"`,
    ].join('\n'),
  },
  {
    name: "Prefix - test",
    expr: "-1",
    tree: [
      `1:1-1:3 prefixOp sub "-1"`,
      `  1:2-1:3 number 1 "1"`,
    ].join('\n'),
  },
  {
    name: "Prefix - with space test",
    expr: "- 1",
    tree: [
      `1:1-1:4 prefixOp sub "- 1"`,
      `  1:3-1:4 number 1 "1"`,
    ].join('\n'),
  },
  {
    name: "Simple infix test",
    expr: "2^128",
    tree: [
      `1:1-1:6 infixOp pow "2^128"`,
      `  1:1-1:2 number 2 "2"`,
      `  1:3-1:6 number 128 "128"`,
    ].join('\n'),
  },
  {
    name: "Postfix test",
    expr: "3!",
    tree: [
      `1:1-1:3 postfixOp fac "3!"`,
      `  1:1-1:2 number 3 "3"`,
    ].join('\n'),
  },
  {
    name: "Double postfix test",
    expr: "3!!",
    tree: [
      `1:1-1:4 postfixOp fac "3!!"`,
      `  1:1-1:3 postfixOp fac "3!"`,
      `    1:1-1:2 number 3 "3"`,
    ].join('\n'),
  },
  {
    name: "Parenthesized postfix test",
    expr: "(4-2)!",
    tree: [
      `1:1-1:7 postfixOp fac "(4-2)!"`,
      `  1:1-1:6 paren "(4-2)"`,
      `    1:2-1:5 infixOp sub "4-2"`,
      `      1:2-1:3 number 4 "4"`,
      `      1:4-1:5 number 2 "2"`,
    ].join('\n'),
  },
  {
    name: "Unary function test",
    expr: "log10(1e5) + 1",
    tree: [
      `1:1-1:15 infixOp add "log10(1e5) + 1"`,
      `  1:1-1:11 func log10 "log10(1e5)"`,
      `    1:7-1:10 number 100000 "1e5"`,
      `  1:14-1:15 number 1 "1"`,
    ].join('\n'),
  },
  {
    name: "Binary function test",
    expr: "max(13.2, 4*5)",
    tree: [
      `1:1-1:15 func max "max(13.2, 4*5)"`,
      `  1:5-1:9 number 13.2 "13.2"`,
      `  1:11-1:14 infixOp mul "4*5"`,
      `    1:11-1:12 number 4 "4"`,
      `    1:13-1:14 number 5 "5"`,
    ].join('\n'),
  },
  {
    name: "Function with aliased name test",
    expr: "round(9.995 * 100)",
    tree: [
      `1:1-1:19 func round "round(9.995 * 100)"`,
      `  1:7-1:18 infixOp mul "9.995 * 100"`,
      `    1:7-1:12 number 9.995 "9.995"`,
      `    1:15-1:18 number 100 "100"`,
    ].join('\n'),
  },
];

export default function parserTests() {
  tests.forEach(test => {
    const result = calc.parse(test.expr);
    assert(result.errors.length === 0,
      `Errors in test "${test.name}": ${result.errors}`);
    assert.equal(result.tree.toString(), test.tree, test.name);
  });
}
