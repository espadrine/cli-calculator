import Calculator from '../index.js';
import assert from 'assert/strict';
import mpWasm from 'mp-wasm';

const calc = new Calculator(mpWasm);

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
];

export default function parserTests() {
  tests.forEach(test => {
    const result = calc.parse(test.expr);
    assert(result.errors.length === 0,
      `Errors in test "${test.name}": ${result.errors}`);
    assert.equal(result.tree.toString(), test.tree, test.name);
  });
}
