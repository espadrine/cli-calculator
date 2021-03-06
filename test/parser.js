import Calculator from '../index.js';
import assert from 'assert/strict';

const calc = new Calculator();

const tests = [
  {
    name: "Simple infix test",
    expr: "2^128",
    tree: [
      `1:1-1:6 infixOp ^ "2^128"`,
      `  1:1-1:2 number 2 "2"`,
      `  1:3-1:6 number 128 "128"`,
    ].join('\n'),
  },
];

export default function parserTests() {
  tests.forEach(test => {
    const result = calc.compute(test.expr);
    assert(result.errors.length === 0,
      `Errors in test "${test.name}": ${result.errors}`);
    assert.equal(result.tree.toString(), test.tree, test.name);
  });
};
