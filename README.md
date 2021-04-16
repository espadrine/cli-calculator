# Precision calculator

*An evaluator for mathematical expression with arbitrary precision.  
Browser and Node.js.*

```js
import Calculator from 'precision-calculator';
import mpWasm from 'mp-wasm';

const calc = new Calculator(mpWasm);
calc.mpf.setDefaultPrec(128);

console.log(calc('round(9.995 * 100)').result[0]);
// → 1000
```

[Example use in a blog article](https://espadrine.github.io/blog/posts/mean-range-of-bell-curve-distributions.html).

**Under the covers:**

- [MPFR][]: a C library for fast arbitrary-precision algorithms.
- [mp-wasm][]: an [MPFR][] compilation into [WASM][].
- A custom, well-tested parser with clear error messages.
- A tree evaluator.

[MPFR]: https://www.mpfr.org
[mp-wasm]: https://github.com/cag/mp-wasm
[WASM]: https://webassembly.org

## Language

Numbers are as usual: `3.1415`, `1E-15`, `2_900_000`.

Operators include `+`, `-`, `*`, `×`, `/`, `÷`, `%` (modulo), `^` and `**`
(power), and `!` for factorials (which support any real number).

The following functions are also supported:
`rootn`, `dim`, `atan2`, `gammaInc`, `beta`, `jn`, `yn`, `agm`, `hypot`, `fmod`,
`remainder`, `min`, `max`, `sqr`, `sqrt`, `recSqrt`, `cbrt`, `neg`, `abs`,
`log`, `ln`, `log2`, `log10`, `log1p`, `exp`, `exp2`, `exp10`, `expm1`, `cos`,
`sin`, `tan`, `sec`, `csc`, `cot`, `acos`, `asin`, `atan`, `cosh`, `sinh`,
`tanh`, `sech`, `csch`, `coth`, `acosh`, `asinh`, `atanh`, `eint`, `li2`,
`gamma`, `lngamma`, `digamma`, `zeta`, `erf`, `erfc`, `j0`, `j1`, `y0`, `y1`,
`rint`, `ceil`, `rintCeil`, `floor`, `rintFloor`, `round`, `rintRound`,
`rintRoundeven`, `trunc`, `rintTrunc`, `frac`.

The syntax also supports lists, such as `(1, 2)`,
to handle multiple computations at once.

Computation results are lists.

## API

### `new Calculator(mpWasm)`

The main, default export, is a class which must be initialized.

It includes a [`.mpf`][mp-wasm] object so that the precision can, in particular,
be set.

### `Calculator.prototype.compute(expression)`

The computation takes a String expression, eg. `"round(9.995 * 100)"`.

It returns an Object with the following fields:

- `result`: a list of [MPFRFloat][mp-wasm] numbers.
- `tree`: the abstract syntax tree representation of the input.
- `errors`: a list of SyntaxTreeError found while parsing or evaluating the
  input.

#### `SyntaxTreeError`

The errors have the following fields:

- `message` describing the error,
- `line` at which the error occured in the String expression (1-indexed),
- `column` (1-indexed).
- `.toString()`: lays out the error in a readable form.

#### `SyntaxTree`

It exports a `.toString()` function which allows convenient introspection of the
abstract syntax tree.

### `Calculator.prototype.parse(expression)`

If you only wish to perform parsing, this will not do the computation.
It works the same way as `.compute()`, but returns only this:

- `tree`: the abstract syntax tree representation of the input.
- `errors`: a list of errors in parsing or evaluating the input.
