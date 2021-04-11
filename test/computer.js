import Calculator from '../index.js';
import assert from 'assert/strict';
import mpWasm from 'mp-wasm';

const calc = new Calculator(mpWasm);
calc.mpf.setDefaultPrec(128);

const tests = [
  {
    name: "Number test",
    expr: "2",
    result: "2",
  },
  {
    name: "Infix test",
    expr: "2^128",
    result: "340282366920938463463374607431768211456",
  },
  {
    name: "Double postfix test",
    expr: "3!!",
    result: "720",
  },
  {
    name: "Parenthesized postfix test",
    expr: "(4-2)!",
    result: "2",
  },
  {
    name: "Unary function test",
    expr: "log10(1e5) + 1",
    result: "6",
  },
  {
    name: "Binary function test",
    expr: "max(13.2, 4*5)",
    result: "20",
  },
  { // Don't try this at home.
    name: "Precision function test",
    expr: "round(9.995 * 100)",
    result: "1000",
  },
];

export default function computerTests() {
  tests.forEach(test => {
    const computation = calc.compute(test.expr);
    assert(computation.errors.length === 0,
      `Errors in test "${test.name}": ${computation.errors}`);
    assert.deepEqual(computation.result.map(v => v.toString()).join(', '),
      test.result, test.name);
  });
}
