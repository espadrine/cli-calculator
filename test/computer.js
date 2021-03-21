import Calculator from '../index.js';
import assert from 'assert/strict';
import mpWasm from 'mp-wasm';

const calc = new Calculator(mpWasm);

const tests = [
  {
    name: "Number test",
    expr: "2",
    result: "2",
  },
  {
    name: "Infix test",
    expr: "2^128",
    result: "3.402823669209385e+38",
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
