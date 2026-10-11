/**
 * Dimensional analysis engine.
 *
 * Powers of the fundamental quantities are tracked as exact rational exponent
 * vectors, so `sqrt(l/g)` yields T^1 and not T^0.9999999.
 *
 * Everything the platform shows about dimensions (Visual Summary chips, the
 * Formula Explorer, the Unit Converter, the checker inside Solved Examples) is
 * derived from this module rather than hard-coded per chapter, which is what
 * lets Chapters 2-13 reuse the exact same components.
 */

export const BASE_DIMENSIONS = ["M", "L", "T", "I", "Θ", "N", "J"] as const;

export type BaseDimension = (typeof BASE_DIMENSIONS)[number];

/** Long-form names used in tooltips and the dimension legend. */
export const DIMENSION_LABELS: Record<BaseDimension, string> = {
  M: "Mass",
  L: "Length",
  T: "Time",
  I: "Electric current",
  Θ: "Temperature",
  N: "Amount of substance",
  J: "Luminous intensity",
};

export const DIMENSION_SYMBOLS: Record<BaseDimension, string> = {
  M: "kg",
  L: "m",
  T: "s",
  I: "A",
  Θ: "K",
  N: "mol",
  J: "cd",
};

/* ------------------------------------------------------------------ */
/* Exact rational arithmetic                                            */
/* ------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export class Fraction {
  readonly n: number;
  readonly d: number;

  constructor(n: number, d = 1) {
    if (d === 0) throw new Error("Fraction with zero denominator");
    if (!Number.isFinite(n) || !Number.isFinite(d)) {
      throw new Error("Fraction with non-finite value");
    }
    const sign = d < 0 ? -1 : 1;
    const g = gcd(n, d);
    this.n = (sign * n) / g;
    this.d = (sign * d) / g;
  }

  static readonly ZERO = new Fraction(0);
  static readonly ONE = new Fraction(1);

  /**
   * Builds an exact fraction from a JS number so that 0.5 renders as `1/2`
   * rather than `0.5` inside a dimension formula.
   */
  static fromNumber(x: number): Fraction {
    if (Number.isInteger(x)) return new Fraction(x);
    for (const d of [2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20, 25, 32, 100, 1000]) {
      const n = x * d;
      if (Math.abs(n - Math.round(n)) < 1e-9) return new Fraction(Math.round(n), d);
    }
    return new Fraction(x);
  }

  add(o: Fraction) {
    return new Fraction(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o: Fraction) {
    return new Fraction(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o: Fraction) {
    return new Fraction(this.n * o.n, this.d * o.d);
  }
  div(o: Fraction) {
    if (o.n === 0) throw new Error("Division by zero fraction");
    return new Fraction(this.n * o.d, this.d * o.n);
  }
  neg() {
    return new Fraction(-this.n, this.d);
  }
  pow(e: number) {
    if (this.d === 1) return new Fraction(this.n ** e);
    if (e === 0.5) return new Fraction(Math.sqrt(this.n), Math.sqrt(this.d));
    throw new Error(`Cannot raise ${this} to ${e}`);
  }
  get isZero() {
    return this.n === 0;
  }
  get value() {
    return this.n / this.d;
  }
  equals(o: Fraction) {
    return this.n === o.n && this.d === o.d;
  }
  toString() {
    return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`;
  }
}

/* ------------------------------------------------------------------ */
/* Exponent vectors                                                     */
/* ------------------------------------------------------------------ */

export type DimVec = Record<BaseDimension, Fraction>;

export function dimVec(partial?: Partial<Record<BaseDimension, number | Fraction>>): DimVec {
  const out = {} as DimVec;
  for (const base of BASE_DIMENSIONS) {
    const v = partial?.[base];
    out[base] = v instanceof Fraction ? v : new Fraction(v ?? 0);
  }
  return out;
}

export const DIMENSIONLESS = dimVec();

function componentwise(op: (a: Fraction, b: Fraction) => Fraction, a: DimVec, b: DimVec): DimVec {
  const out = {} as DimVec;
  for (const base of BASE_DIMENSIONS) out[base] = op(a[base], b[base]);
  return out;
}

export const addDims = (a: DimVec, b: DimVec) => componentwise((x, y) => x.add(y), a, b);
export const subDims = (a: DimVec, b: DimVec) => componentwise((x, y) => x.sub(y), a, b);

/**
 * Multiplying two dimensions adds their exponents (`kg * m/s²` -> `M¹L¹T⁻²`),
 * so these are deliberately aliases of `addDims` / `subDims`.
 */
export const mulDims = addDims;
export const divDims = subDims;

export function scaleDim(v: DimVec, k: Fraction): DimVec {
  const out = {} as DimVec;
  for (const base of BASE_DIMENSIONS) out[base] = v[base].mul(k);
  return out;
}

export function powDim(v: DimVec, e: number): DimVec {
  return scaleDim(v, Fraction.fromNumber(e));
}

export function dimsEqual(a: DimVec, b: DimVec): boolean {
  return BASE_DIMENSIONS.every((base) => a[base].equals(b[base]));
}

export function isDimensionless(v: DimVec): boolean {
  return BASE_DIMENSIONS.every((base) => v[base].isZero);
}

/** Renders `[M1L1T-2]`, dropping zero powers and dimensionless results. */
export function formatDim(v: DimVec): string {
  if (isDimensionless(v)) return "[M0L0T0]";
  const parts = BASE_DIMENSIONS.filter((base) => !v[base].isZero).map(
    (base) => `${base}${v[base].toString()}`,
  );
  return `[${parts.join("")}]`;
}

/** Renders `M¹ L¹ T⁻²` for display where the bracketed form is too dense. */
const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "-": "⁻", "/": "ᐟ",
};

export function formatDimSpaced(v: DimVec): string {
  if (isDimensionless(v)) return "dimensionless";
  return BASE_DIMENSIONS.filter((base) => !v[base].isZero)
    .map((base) => {
      const f = v[base];
      let out = base;
      for (const ch of f.toString()) out += SUPERSCRIPT[ch] ?? ch;
      return out;
    })
    .join(" ");
}

/** The SI unit implied by a dimension vector, e.g. `[M1L1T-2]` -> `kg·m·s⁻²`. */
export function siUnitFor(v: DimVec): string {
  if (isDimensionless(v)) return "—";
  const num: string[] = [];
  const den: string[] = [];
  for (const base of BASE_DIMENSIONS) {
    const f = v[base];
    if (f.isZero) continue;
    const sym = DIMENSION_SYMBOLS[base];
    if (f.n > 0) num.push(f.d === 1 ? sym : `${sym}${f}`);
    else den.push(f.d === 1 ? sym : `${sym}${new Fraction(-f.n, f.d)}`);
  }
  const n = num.join("·");
  const d = den.join("·");
  if (!d) return n;
  return `${n}/${d}`;
}

/* ------------------------------------------------------------------ */
/* Symbol tables                                                        */
/* ------------------------------------------------------------------ */

export interface QuantitySymbol {
  name: string;
  dim: DimVec;
  label: string;
}

/** The symbols students are expected to recognise from Chapter 1 onward. */
export const QUANTITY_SYMBOLS: QuantitySymbol[] = [
  { name: "length", label: "Length", dim: dimVec({ L: 1 }) },
  { name: "breadth", label: "Breadth", dim: dimVec({ L: 1 }) },
  { name: "height", label: "Height", dim: dimVec({ L: 1 }) },
  { name: "distance", label: "Distance", dim: dimVec({ L: 1 }) },
  { name: "radius", label: "Radius", dim: dimVec({ L: 1 }) },
  { name: "area", label: "Area", dim: dimVec({ L: 2 }) },
  { name: "volume", label: "Volume", dim: dimVec({ L: 3 }) },
  { name: "mass", label: "Mass", dim: dimVec({ M: 1 }) },
  { name: "time", label: "Time", dim: dimVec({ T: 1 }) },
  { name: "velocity", label: "Velocity", dim: dimVec({ L: 1, T: -1 }) },
  { name: "acceleration", label: "Acceleration", dim: dimVec({ L: 1, T: -2 }) },
  { name: "force", label: "Force", dim: dimVec({ M: 1, L: 1, T: -2 }) },
  { name: "work", label: "Work", dim: dimVec({ M: 1, L: 2, T: -2 }) },
  { name: "energy", label: "Energy", dim: dimVec({ M: 1, L: 2, T: -2 }) },
  { name: "power", label: "Power", dim: dimVec({ M: 1, L: 2, T: -3 }) },
  { name: "pressure", label: "Pressure", dim: dimVec({ M: 1, L: -1, T: -2 }) },
  { name: "stress", label: "Stress", dim: dimVec({ M: 1, L: -1, T: -2 }) },
  { name: "strain", label: "Strain", dim: dimVec() },
  { name: "momentum", label: "Momentum", dim: dimVec({ M: 1, L: 1, T: -1 }) },
  { name: "impulse", label: "Impulse", dim: dimVec({ M: 1, L: 1, T: -1 }) },
  { name: "density", label: "Density", dim: dimVec({ M: 1, L: -3 }) },
  { name: "frequency", label: "Frequency", dim: dimVec({ T: -1 }) },
  { name: "angle", label: "Angle", dim: dimVec() },
  { name: "solidangle", label: "Solid angle", dim: dimVec() },
  { name: "timetable", label: "Time period", dim: dimVec({ T: 1 }) },
  { name: "temperature", label: "Temperature", dim: dimVec({ Θ: 1 }) },
];

/**
 * Single-letter conventions used throughout the textbook, e.g. `F = mv2/r`.
 *
 * Only unambiguous letters live here. Physics reuses the same letter for
 * different quantities across chapters (`h` is a height in Example 5 but
 * Planck's constant in Exercise 3.1), so anything context-dependent is supplied
 * per problem through the `symbols` option instead of being guessed globally.
 */
export const LETTER_SYMBOLS: Record<string, QuantitySymbol> = {
  m: { name: "m", label: "Mass", dim: dimVec({ M: 1 }) },
  l: { name: "l", label: "Length", dim: dimVec({ L: 1 }) },
  b: { name: "b", label: "Length (breadth)", dim: dimVec({ L: 1 }) },
  s: { name: "s", label: "Distance", dim: dimVec({ L: 1 }) },
  S: { name: "S", label: "Distance", dim: dimVec({ L: 1 }) },
  x: { name: "x", label: "Distance", dim: dimVec({ L: 1 }) },
  r: { name: "r", label: "Radius", dim: dimVec({ L: 1 }) },
  t: { name: "t", label: "Time", dim: dimVec({ T: 1 }) },
  T: { name: "T", label: "Time", dim: dimVec({ T: 1 }) },
  F: { name: "F", label: "Force", dim: dimVec({ M: 1, L: 1, T: -2 }) },
  N: { name: "N", label: "Force", dim: dimVec({ M: 1, L: 1, T: -2 }) },
  w: { name: "w", label: "Weight", dim: dimVec({ M: 1, L: 1, T: -2 }) },
  v: { name: "v", label: "Velocity", dim: dimVec({ L: 1, T: -1 }) },
  u: { name: "u", label: "Velocity", dim: dimVec({ L: 1, T: -1 }) },
  a: { name: "a", label: "Acceleration", dim: dimVec({ L: 1, T: -2 }) },
  g: { name: "g", label: "Acceleration due to gravity", dim: dimVec({ L: 1, T: -2 }) },
  V: { name: "V", label: "Volume", dim: dimVec({ L: 3 }) },
  A: { name: "A", label: "Area", dim: dimVec({ L: 2 }) },
  W: { name: "W", label: "Work / Energy", dim: dimVec({ M: 1, L: 2, T: -2 }) },
  E: { name: "E", label: "Energy", dim: dimVec({ M: 1, L: 2, T: -2 }) },
  J: { name: "J", label: "Energy", dim: dimVec({ M: 1, L: 2, T: -2 }) },
  P: { name: "P", label: "Power", dim: dimVec({ M: 1, L: 2, T: -3 }) },
  d: { name: "d", label: "Density", dim: dimVec({ M: 1, L: -3 }) },
  rho: { name: "rho", label: "Density", dim: dimVec({ M: 1, L: -3 }) },
  h: { name: "h", label: "Height", dim: dimVec({ L: 1 }) },
  theta: { name: "theta", label: "Plane angle", dim: dimVec() },
  lamda: { name: "lamda", label: "Wavelength", dim: dimVec({ L: 1 }) },
};

/** Trig / logarithmic functions and other dimensionless constants. */
const DIMENSIONLESS_FUNCTIONS = new Set([
  "sin", "cos", "tan", "sec", "csc", "cot", "log", "ln", "exp", "pi",
]);

/** Roots act as power operators rather than opaque functions. */
const ROOT_EXPONENTS: Record<string, number> = {
  sqrt: 0.5,
  cbrt: 1 / 3,
};

/* ------------------------------------------------------------------ */
/* Tokenizer + recursive-descent parser                                 */
/* ------------------------------------------------------------------ */

type Token =
  | { type: "ident"; value: string }
  | { type: "number"; value: number }
  | { type: "op"; value: string };

const OPERATORS = new Set(["*", "/", "+", "-", "^", "(", ")"]);

const IDENT_CHAR = /[a-zA-ZΘΩθ]/;

/**
 * Words the tokenizer may greedily absorb. Anything else is split into single
 * letters so `mv2` becomes `m · v²` while `velocity` stays one token.
 */
const VOCABULARY: string[] = [
  ...QUANTITY_SYMBOLS.map((q) => q.name),
  ...Object.keys(LETTER_SYMBOLS),
  ...DIMENSIONLESS_FUNCTIONS,
  ...Object.keys(ROOT_EXPONENTS),
].sort((a, b) => b.length - a.length);

/** Letters that may stand alone as a symbol, which is what makes splitting safe. */
const SINGLE_LETTER_SYMBOLS = new Set(
  Object.keys(LETTER_SYMBOLS).filter((key) => key.length === 1),
);

function identifierRun(input: string, start: number): string {
  let end = start;
  while (end < input.length && IDENT_CHAR.test(input[end])) end++;
  return input.slice(start, end);
}

/**
 * Decides what a run of letters at `start` means.
 *
 * Preference order matters. A known word wins (`mass` is not `m·a·s·s`); then a
 * run made entirely of single-letter symbols is split one letter at a time
 * (`mv2` is `m · v²`); only if neither applies is the whole run kept as one
 * name, so per-problem symbols such as `eta` survive.
 */
function readIdentifier(input: string, start: number): string {
  for (const word of VOCABULARY) {
    if (input.startsWith(word, start)) return word;
  }

  const run = identifierRun(input, start);
  if (run.length === 1) return run;

  const splittable = [...run].every((ch) => SINGLE_LETTER_SYMBOLS.has(ch));
  return splittable ? run[0] : run;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === " " || ch === "\t" || ch === "\n") {
      i++;
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let j = i;
      while (j < input.length && input[j] >= "0" && input[j] <= "9") j++;
      // Decimal point, but never a stray dot.
      if (input[j] === "." && input[j + 1] >= "0" && input[j + 1] <= "9") {
        j++;
        while (j < input.length && input[j] >= "0" && input[j] <= "9") j++;
      }
      tokens.push({ type: "number", value: Number(input.slice(i, j)) });
      i = j;
      continue;
    }

    if (IDENT_CHAR.test(ch)) {
      const word = readIdentifier(input, i);
      tokens.push({ type: "ident", value: word });
      i += word.length;
      continue;
    }

    if (OPERATORS.has(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    throw new SyntaxError(`Unexpected character "${ch}" at position ${i}`);
  }

  return tokens;
}

export type Node =
  | { kind: "number"; value: number }
  | { kind: "symbol"; name: string }
  | { kind: "binary"; op: "*" | "/" | "+" | "-"; left: Node; right: Node }
  | { kind: "power"; base: Node; exponent: Node };

class Parser {
  private pos = 0;

  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Node {
    const node = this.parseSum();
    if (this.pos < this.tokens.length) {
      throw new SyntaxError(`Unexpected trailing "${this.describe(this.tokens[this.pos])}"`);
    }
    return node;
  }

  private describe(token: Token | undefined): string {
    return token && (token.type === "ident" || token.type === "op") ? token.value : "end of input";
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private parseSum(): Node {
    let left = this.parseProduct();
    for (;;) {
      const token = this.peek();
      if (!token || token.type !== "op" || (token.value !== "+" && token.value !== "-")) break;
      this.pos++;
      left = { kind: "binary", op: token.value, left, right: this.parseProduct() };
    }
    return left;
  }

  private parseProduct(): Node {
    let left = this.parseUnary();
    for (;;) {
      const token = this.peek();
      if (token && token.type === "op" && (token.value === "*" || token.value === "/")) {
        this.pos++;
        left = { kind: "binary", op: token.value, left, right: this.parseUnary() };
        continue;
      }
      // Implicit multiplication: a coefficient in front of a symbol, or two
      // adjacent factors such as `m*v` written as `mv`.
      const next = this.peek();
      if (next && next.type === "number") break;
      if (next && next.type === "ident") {
        left = { kind: "binary", op: "*", left, right: this.parseUnary() };
        continue;
      }
      break;
    }
    return left;
  }

  private parseUnary(): Node {
    const token = this.peek();

    if (token && token.type === "op" && token.value === "(") {
      this.pos++;
      const inner = this.parseSum();
      const close = this.peek();
      if (!close || close.type !== "op" || close.value !== ")") {
        throw new SyntaxError("Expected a closing parenthesis");
      }
      this.pos++;
      return inner;
    }

    if (token && token.type === "number") {
      this.pos++;
      const node: Node = { kind: "number", value: token.value };
      return this.maybePower(node);
    }

    if (token && token.type === "ident") {
      this.pos++;

      // `sqrt(x)` / `cbrt(x)` are power operators: the argument keeps its
      // dimensions, scaled by 1/2 or 1/3.
      const rootExponent = ROOT_EXPONENTS[token.value];
      if (rootExponent !== undefined) {
        const argument = this.parseUnary();
        return { kind: "power", base: argument, exponent: { kind: "number", value: rootExponent } };
      }

      // `sin(x)`, `cos(x)` etc. — collapse the whole call to a constant.
      const after = this.peek();
      if (after && after.type === "op" && after.value === "(" && DIMENSIONLESS_FUNCTIONS.has(token.value)) {
        let depth = 0;
        do {
          const t = this.tokens[this.pos++];
          if (!t) throw new SyntaxError("Unterminated function call");
          if (t.type === "op" && t.value === "(") depth++;
          if (t.type === "op" && t.value === ")") depth--;
        } while (depth > 0);
        return { kind: "number", value: 1 };
      }
      return this.maybePower({ kind: "symbol", name: token.value });
    }

    throw new SyntaxError(`Unexpected "${this.describe(token)}"`);
  }

  /** Attaches `^n` and also the `v2` shorthand for `v^2`. */
  private maybePower(base: Node): Node {
    const token = this.peek();
    if (!token) return base;

    if (token.type === "op" && token.value === "^") {
      this.pos++;
      const exponent = this.parseUnary();
      return { kind: "power", base, exponent };
    }

    // Physics notation is directional: a number *after* a symbol is its power
    // (`mv2` -> m·v²), while a number before one is a coefficient (`2m` -> 2·m).
    // The coefficient case never reaches here, because parseProduct only enters
    // this path having just consumed a symbol.
    if (token.type === "number" && base.kind === "symbol" && Number.isInteger(token.value)) {
      this.pos++;
      return { kind: "power", base, exponent: { kind: "number", value: token.value } };
    }

    return base;
  }
}

export function parseExpression(input: string): Node {
  const trimmed = input.replace(/[−–—]/g, "-").replace(/[·×⋅]/g, "*").replace(/÷/g, "/");
  const tokens = tokenize(trimmed);
  if (tokens.length === 0) throw new SyntaxError("Empty expression");
  return new Parser(tokens).parse();
}

/* ------------------------------------------------------------------ */
/* Evaluation                                                           */
/* ------------------------------------------------------------------ */

export interface EvalResult {
  dim: DimVec;
  /** Set when the expression is a sum whose terms do not share dimensions. */
  error?: string;
}

const ZERO = Fraction.ZERO;
const ONE = Fraction.ONE;

/** Splits a sum into signed top-level terms. `a - b + c` -> +a, -b, +c. */
function flattenSum(node: Node, sign = 1): { node: Node; sign: number }[] {
  if (node.kind === "binary" && (node.op === "+" || node.op === "-")) {
    return [
      ...flattenSum(node.left, sign),
      ...flattenSum(node.right, node.op === "-" ? -sign : sign),
    ];
  }
  return [{ node, sign }];
}

function numericValueOf(node: Node): number | null {
  switch (node.kind) {
    case "number":
      return node.value;
    case "binary": {
      const l = numericValueOf(node.left);
      const r = numericValueOf(node.right);
      if (l === null || r === null) return null;
      if (node.op === "*") return l * r;
      if (node.op === "/") return r === 0 ? null : l / r;
      if (node.op === "+") return l + r;
      return l - r;
    }
    case "power": {
      const base = numericValueOf(node.base);
      const exp = numericValueOf(node.exponent);
      if (base === null || exp === null) return null;
      return base ** exp;
    }
    default:
      return null;
  }
}

/** Total exponent of `name` inside an expression, or null if it is not a simple power. */
function exponentOf(node: Node, name: string): Fraction | null {
  switch (node.kind) {
    case "symbol":
      return node.name === name ? ONE : ZERO;
    case "number":
      return ZERO;
    case "power": {
      const inner = exponentOf(node.base, name);
      if (inner === null) return null;
      const exp = numericValueOf(node.exponent);
      if (exp === null) return null;
      return inner.mul(new Fraction(exp));
    }
    case "binary": {
      if (node.op === "+" || node.op === "-") return null; // occurrence inside a sum
      const l = exponentOf(node.left, name);
      const r = exponentOf(node.right, name);
      if (l === null || r === null) return null;
      return node.op === "*" ? l.add(r) : l.sub(r);
    }
    default:
      return null;
  }
}

function occursIn(node: Node, name: string): boolean {
  switch (node.kind) {
    case "symbol":
      return node.name === name;
    case "number":
      return false;
    case "power":
      return occursIn(node.base, name);
    case "binary":
      return occursIn(node.left, name) || occursIn(node.right, name);
    default:
      return false;
  }
}

/**
 * Plain, serialisable exponent specification, e.g. `{ M: 1, L: -1, T: -2 }`.
 *
 * Chapter data is authored as `DimSpec` rather than `DimVec` because `DimVec`
 * holds `Fraction` instances, which React refuses to send from a Server
 * Component to a Client Component.
 */
export type DimSpec = Partial<Record<BaseDimension, number>>;

export function specToVec(spec: DimSpec): DimVec {
  return dimVec(spec);
}

/** Per-problem symbol meanings that shadow the global defaults. */
export type SymbolEnv = Record<string, DimSpec>;

function resolveSymbol(name: string, env: SymbolEnv = {}): DimVec {
  if (env[name]) return specToVec(env[name]);
  if (LETTER_SYMBOLS[name]) return LETTER_SYMBOLS[name].dim;
  if (DIMENSIONLESS_FUNCTIONS.has(name)) return DIMENSIONLESS;
  const named = QUANTITY_SYMBOLS.find((q) => q.name === name.toLowerCase());
  if (named) return named.dim;
  throw new Error(`Unknown symbol "${name}"`);
}

function evaluateNode(
  node: Node,
  unknowns: ReadonlySet<string> = EMPTY_SET,
  env: SymbolEnv = {},
): DimVec {
  switch (node.kind) {
    case "number":
      return DIMENSIONLESS;
    case "symbol":
      if (unknowns.has(node.name)) return DIMENSIONLESS;
      return resolveSymbol(node.name, env);
    case "power": {
      const exp = numericValueOf(node.exponent);
      if (exp === null) throw new Error("Exponent must be a plain number");
      return powDim(evaluateNode(node.base, unknowns, env), exp);
    }
    case "binary": {
      const left = evaluateNode(node.left, unknowns, env);
      const right = evaluateNode(node.right, unknowns, env);
      if (node.op === "*") return mulDims(left, right);
      if (node.op === "/") return divDims(left, right);
      throw new Error("Addition is handled by the caller");
    }
  }
}

/**
 * Dimensions of a single expression such as `m/v` or `F*d/(A*v)`.
 *
 * Only like quantities may be added, so a sum of mismatched terms comes back
 * with an `error` rather than a meaningless vector.
 */
export function evaluate(input: string, env: SymbolEnv = {}): EvalResult {
  try {
    return evaluateSide(parseExpression(input), EMPTY_SET, env);
  } catch (error) {
    return {
      dim: DIMENSIONLESS,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/* ------------------------------------------------------------------ */
/* Whole-equation analysis                                              */
/* ------------------------------------------------------------------ */

export type Verdict = "correct" | "incorrect" | "indeterminate" | "solved";

export interface AnalysisResult {
  left: DimVec | null;
  right: DimVec | null;
  homogeneous: boolean;
  verdict: Verdict;
  message: string;
  /** Dimensions solved for the symbols requested via `solveFor`. */
  solved: Record<string, DimVec>;
  /** Symbols that could not be isolated, keyed by symbol. */
  unsolved: string[];
  error?: string;
}

interface SideResult {
  dim: DimVec;
  /** Set when the side is a sum whose terms do not share dimensions. */
  error?: string;
}

/**
 * Reduces one side of an equation to a single dimension vector.
 *
 * A sum only collapses when every term shares dimensions — that check is the
 * whole point of the homogeneity principle, so it is surfaced rather than
 * silently ignored.
 */
function evaluateSide(
  node: Node,
  unknowns: ReadonlySet<string>,
  env: SymbolEnv,
): SideResult {
  const terms = flattenSum(node);
  const dims = terms.map((term) => evaluateNode(term.node, unknowns, env));
  const reference = dims[0];

  for (let i = 1; i < dims.length; i++) {
    if (!dimsEqual(reference, dims[i])) {
      return {
        dim: reference,
        error: `Only like quantities can be added — term ${i + 1} is ${formatDim(dims[i])}, not ${formatDim(reference)}.`,
      };
    }
  }

  return { dim: reference };
}

/**
 * Checks dimensional homogeneity of `lhs = rhs`, and optionally solves for the
 * dimensions of unknown symbols.
 *
 * Two isolation strategies are tried, in order:
 *
 * 1. **Group matching** — inside an additive group, like quantities must share
 *    dimensions. If exactly one term carries the unknown, its dimensions are
 *    forced to match a sibling. This is how the textbook's gas-law exercise is
 *    solved: `(P + a/v²)` shares dimensions with `P`, so `[a] = [P]·[v]²`.
 *
 * 2. **Single occurrence** — if the unknown appears in exactly one term of the
 *    whole equation, the remaining terms can be moved across and divided out.
 *
 * When neither applies the solver reports the symbol as unsolved instead of
 * guessing, because a plausible-looking wrong dimension is worse than none.
 */
export function analyse(
  equation: string,
  solveFor: string[] = [],
  env: SymbolEnv = {},
): AnalysisResult {
  try {
    const [lhsRaw, rhsRaw] = splitEquation(equation);
    const lhsNode = parseExpression(lhsRaw);
    const rhsNode = parseExpression(rhsRaw);

    const solved: Record<string, DimVec> = {};
    const unsolved: string[] = [];
    // Every requested symbol stays unknown while solving any one of them,
    // otherwise `A` in `v = A·t + b/t + c` would resolve to *area*.
    const unknowns: ReadonlySet<string> = new Set(solveFor);

    if (solveFor.length === 0) {
      const left = evaluateSide(lhsNode, EMPTY_SET, env);
      const right = evaluateSide(rhsNode, EMPTY_SET, env);

      // A sum of unlike quantities is itself proof the equation cannot hold.
      const mismatch = left.error ?? right.error;
      if (mismatch) {
        return {
          left: left.dim,
          right: right.dim,
          homogeneous: false,
          verdict: "incorrect",
          message: mismatch,
          solved,
          unsolved,
        };
      }

      const homogeneous = dimsEqual(left.dim, right.dim);
      return {
        left: left.dim,
        right: right.dim,
        homogeneous,
        verdict: homogeneous ? "correct" : "incorrect",
        message: homogeneous
          ? `Both sides reduce to ${formatDim(left.dim)} — the relation is dimensionally correct.`
          : `Left side is ${formatDim(left.dim)} but the right side is ${formatDim(right.dim)} — not homogeneous.`,
        solved,
        unsolved,
      };
    }

    for (const name of solveFor) {
      const found =
        solveByGrouping(lhsNode, rhsNode, name, unknowns, env) ??
        solveByOccurrence(lhsNode, rhsNode, name, unknowns, env);
      if (found) solved[name] = found;
      else unsolved.push(name);
    }

    if (unsolved.length > 0) {
      return {
        left: null,
        right: null,
        homogeneous: false,
        verdict: "indeterminate",
        message: `${unsolved.join(", ")} ${unsolved.length > 1 ? "cannot" : "cannot"} be isolated — it shares a sum with another unknown, so dimensional analysis alone does not determine ${
          unsolved.length > 1 ? "them" : "it"
        }.`,
        solved,
        unsolved,
      };
    }

    const parts = solveFor.map((name) => `[${name}] = ${formatDim(solved[name])}`);
    return {
      left: null,
      right: null,
      homogeneous: false,
      verdict: "solved",
      message: parts.join("   ·   "),
      solved,
      unsolved,
    };
  } catch (error) {
    return {
      left: null,
      right: null,
      homogeneous: false,
      verdict: "indeterminate",
      message: "Could not parse that equation.",
      solved: {},
      unsolved: [...solveFor],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const EMPTY_SET: ReadonlySet<string> = new Set();

function splitEquation(equation: string): [string, string] {
  const normalised = equation.replace(/[−–—]/g, "-");
  for (let i = 0; i < normalised.length; i++) {
    const ch = normalised[i];
    if (ch !== "=") continue;
    let depth = 0;
    let second = -1;
    for (let j = i + 1; j < normalised.length; j++) {
      if (normalised[j] === "(") depth++;
      else if (normalised[j] === ")") depth--;
      else if (normalised[j] === "=" && depth === 0) {
        second = j;
        break;
      }
    }
    if (second !== -1) {
      throw new Error("Only a single '=' is supported");
    }
    return [normalised.slice(0, i), normalised.slice(i + 1)];
  }
  throw new Error("No '=' found — enter an equation such as F = m*a");
}

/** Every additive group anywhere in the tree, including the root. */
function additiveGroups(node: Node): Node[] {
  const groups: Node[] = [];
  const walk = (current: Node) => {
    if (current.kind === "binary" && (current.op === "+" || current.op === "-")) {
      groups.push(current);
    }
    // Descend unconditionally: an unknown is often nested inside a product,
    // as in `(P + a/v²)(v − b)`.
    if (current.kind === "binary") {
      walk(current.left);
      walk(current.right);
    } else if (current.kind === "power") {
      walk(current.base);
    }
  };
  walk(node);
  return groups;
}

/** True when `name` appears only as a plain power (never inside a sum). */
function hasSimplePower(node: Node, name: string): boolean {
  return exponentOf(node, name) !== null;
}

/** `[P + a/v²]`: the one unknown-bearing term must match its siblings. */
function solveByGrouping(
  lhsNode: Node,
  rhsNode: Node,
  name: string,
  unknowns: ReadonlySet<string>,
  env: SymbolEnv,
): DimVec | null {
  for (const group of [...additiveGroups(lhsNode), ...additiveGroups(rhsNode)]) {
    const terms = flattenSum(group);
    const withUnknown = terms.filter((term) => occursIn(term.node, name));

    if (withUnknown.length !== 1) continue;
    const target = withUnknown[0];
    if (!hasSimplePower(target.node, name)) continue;

    const siblings = terms.filter((term) => !occursIn(term.node, name));
    if (siblings.length === 0) continue;

    try {
      // Evaluating with `name` treated as dimensionless leaves exactly the rest
      // of the product, so [rest] = [term] / [name].
      const rest = evaluateNode(target.node, unknowns, env);
      const reference = evaluateNode(siblings[0].node, unknowns, env);

      // The siblings must agree with each other, otherwise the group is not a
      // like-quantity sum and nothing forces the unknown to match anything.
      for (const sibling of siblings) {
        if (!dimsEqual(evaluateNode(sibling.node, unknowns, env), reference)) return null;
      }

      return divDims(reference, rest);
    } catch {
      continue;
    }
  }
  return null;
}

/** `λ = h/(mv)`: the unknown occurs once in the entire equation. */
function solveByOccurrence(
  lhsNode: Node,
  rhsNode: Node,
  name: string,
  unknowns: ReadonlySet<string>,
  env: SymbolEnv,
): DimVec | null {
  const terms = [
    ...flattenSum(lhsNode, 1),
    ...flattenSum(rhsNode, -1),
  ];

  const carrying = terms.filter((term) => occursIn(term.node, name));
  if (carrying.length !== 1) return null;
  const target = carrying[0];

  const power = exponentOf(target.node, name);
  if (power === null || power.isZero) return null;

  const total = power.mul(new Fraction(target.sign));
  if (total.isZero) return null;

  // Constant part: every term evaluated with the unknown treated as dimensionless.
  let constant = DIMENSIONLESS;
  let reference: DimVec | null = null;

  for (const term of terms) {
    let dim: DimVec;
    try {
      dim = evaluateNode(term.node, unknowns, env);
    } catch {
      return null;
    }

    if (!occursIn(term.node, name)) {
      // Subtracting the remaining terms is only meaningful when they share
      // dimensions. Without this guard `v = A·t + b/t + c` would happily return
      // [A] = [v] even though it is actually under-determined.
      if (reference === null) {
        reference = dim;
      } else if (!dimsEqual(reference, dim)) {
        return null;
      }
    }

    constant = term.sign > 0 ? addDims(constant, dim) : subDims(constant, dim);
  }

  return scaleDim(constant, new Fraction(-1).div(total));
}

/* ------------------------------------------------------------------ */
/* Unit conversion                                                      */
/* ------------------------------------------------------------------ */

export interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  dim: DimVec;
  /** Magnitude of this unit expressed in the corresponding SI base unit. */
  factor: number;
  /** Celsius -> kelvin style offset, applied before scaling. */
  offset?: number;
  system: "SI" | "CGS" | "FPS" | "MKS" | "Other";
}

/**
 * Conversion factors are needed because dimensions alone cannot relate
 * kilogram to gram — only a concrete magnitude table can.
 */
export const UNITS: UnitDef[] = [
  { id: "length-s", label: "Length", symbol: "m", dim: dimVec({ L: 1 }), factor: 1, system: "SI" },
  { id: "length-cm", label: "Length", symbol: "cm", dim: dimVec({ L: 1 }), factor: 0.01, system: "CGS" },
  { id: "length-mm", label: "Length", symbol: "mm", dim: dimVec({ L: 1 }), factor: 0.001, system: "SI" },
  { id: "length-km", label: "Length", symbol: "km", dim: dimVec({ L: 1 }), factor: 1000, system: "SI" },
  { id: "length-ft", label: "Length", symbol: "ft", dim: dimVec({ L: 1 }), factor: 0.3048, system: "FPS" },
  { id: "length-in", label: "Length", symbol: "in", dim: dimVec({ L: 1 }), factor: 0.0254, system: "FPS" },
  { id: "length-mile", label: "Length", symbol: "mi", dim: dimVec({ L: 1 }), factor: 1609.344, system: "FPS" },
  { id: "length-angstrom", label: "Length", symbol: "Å", dim: dimVec({ L: 1 }), factor: 1e-10, system: "Other" },
  { id: "length-fermi", label: "Length", symbol: "fm", dim: dimVec({ L: 1 }), factor: 1e-15, system: "Other" },
  { id: "length-micron", label: "Length", symbol: "µm", dim: dimVec({ L: 1 }), factor: 1e-6, system: "Other" },
  { id: "length-ly", label: "Length", symbol: "ly", dim: dimVec({ L: 1 }), factor: 9.46e15, system: "Other" },
  { id: "length-pc", label: "Length", symbol: "pc", dim: dimVec({ L: 1 }), factor: 3.26 * 9.46e15, system: "Other" },

  { id: "mass-kg", label: "Mass", symbol: "kg", dim: dimVec({ M: 1 }), factor: 1, system: "SI" },
  { id: "mass-g", label: "Mass", symbol: "g", dim: dimVec({ M: 1 }), factor: 0.001, system: "CGS" },
  { id: "mass-mg", label: "Mass", symbol: "mg", dim: dimVec({ M: 1 }), factor: 1e-6, system: "CGS" },
  { id: "mass-lb", label: "Mass", symbol: "lb", dim: dimVec({ M: 1 }), factor: 0.4536, system: "FPS" },
  { id: "mass-tonne", label: "Mass", symbol: "t", dim: dimVec({ M: 1 }), factor: 1000, system: "SI" },
  { id: "mass-quintal", label: "Mass", symbol: "q", dim: dimVec({ M: 1 }), factor: 100, system: "Other" },

  { id: "time-s", label: "Time", symbol: "s", dim: dimVec({ T: 1 }), factor: 1, system: "SI" },
  { id: "time-ms", label: "Time", symbol: "ms", dim: dimVec({ T: 1 }), factor: 0.001, system: "SI" },
  { id: "time-min", label: "Time", symbol: "min", dim: dimVec({ T: 1 }), factor: 60, system: "SI" },
  { id: "time-h", label: "Time", symbol: "h", dim: dimVec({ T: 1 }), factor: 3600, system: "SI" },
  { id: "time-day", label: "Time", symbol: "day", dim: dimVec({ T: 1 }), factor: 86400, system: "SI" },

  { id: "force-n", label: "Force", symbol: "N", dim: dimVec({ M: 1, L: 1, T: -2 }), factor: 1, system: "SI" },
  { id: "force-dyne", label: "Force", symbol: "dyn", dim: dimVec({ M: 1, L: 1, T: -2 }), factor: 1e-5, system: "CGS" },
  { id: "force-kp", label: "Force", symbol: "kgf", dim: dimVec({ M: 1, L: 1, T: -2 }), factor: 9.80665, system: "MKS" },

  { id: "work-j", label: "Work / Energy", symbol: "J", dim: dimVec({ M: 1, L: 2, T: -2 }), factor: 1, system: "SI" },
  { id: "work-erg", label: "Work / Energy", symbol: "erg", dim: dimVec({ M: 1, L: 2, T: -2 }), factor: 1e-7, system: "CGS" },

  { id: "power-w", label: "Power", symbol: "W", dim: dimVec({ M: 1, L: 2, T: -3 }), factor: 1, system: "SI" },
  { id: "power-erg-s", label: "Power", symbol: "erg/s", dim: dimVec({ M: 1, L: 2, T: -3 }), factor: 1e-7, system: "CGS" },

  { id: "pressure-pa", label: "Pressure / Stress", symbol: "Pa", dim: dimVec({ M: 1, L: -1, T: -2 }), factor: 1, system: "SI" },
  { id: "pressure-atm", label: "Pressure / Stress", symbol: "atm", dim: dimVec({ M: 1, L: -1, T: -2 }), factor: 101325, system: "Other" },
  { id: "pressure-bar", label: "Pressure / Stress", symbol: "bar", dim: dimVec({ M: 1, L: -1, T: -2 }), factor: 1e5, system: "SI" },
  { id: "pressure-mmhg", label: "Pressure / Stress", symbol: "mmHg", dim: dimVec({ M: 1, L: -1, T: -2 }), factor: 133.322, system: "Other" },

  { id: "density-kgm3", label: "Density", symbol: "kg/m³", dim: dimVec({ M: 1, L: -3 }), factor: 1, system: "SI" },
  { id: "density-gcm3", label: "Density", symbol: "g/cm³", dim: dimVec({ M: 1, L: -3 }), factor: 1000, system: "CGS" },

  { id: "velocity-ms", label: "Velocity", symbol: "m/s", dim: dimVec({ L: 1, T: -1 }), factor: 1, system: "SI" },
  { id: "velocity-cms", label: "Velocity", symbol: "cm/s", dim: dimVec({ L: 1, T: -1 }), factor: 0.01, system: "CGS" },
  { id: "velocity-kmh", label: "Velocity", symbol: "km/h", dim: dimVec({ L: 1, T: -1 }), factor: 1 / 3.6, system: "SI" },

  { id: "accel-ms2", label: "Acceleration", symbol: "m/s²", dim: dimVec({ L: 1, T: -2 }), factor: 1, system: "SI" },
  { id: "accel-cms2", label: "Acceleration", symbol: "cm/s²", dim: dimVec({ L: 1, T: -2 }), factor: 0.01, system: "CGS" },
  { id: "accel-kmh2", label: "Acceleration", symbol: "km/h²", dim: dimVec({ L: 1, T: -2 }), factor: 1 / 12.96, system: "SI" },

  { id: "current-a", label: "Electric current", symbol: "A", dim: dimVec({ I: 1 }), factor: 1, system: "SI" },
  { id: "charge-c", label: "Charge", symbol: "C", dim: dimVec({ I: 1, T: 1 }), factor: 1, system: "SI" },

  { id: "temp-k", label: "Temperature", symbol: "K", dim: dimVec({ Θ: 1 }), factor: 1, system: "SI" },
  { id: "temp-c", label: "Temperature", symbol: "°C", dim: dimVec({ Θ: 1 }), factor: 1, offset: 273.15, system: "Other" },
  { id: "temp-f", label: "Temperature", symbol: "°F", dim: dimVec({ Θ: 1 }), factor: 5 / 9, offset: 255.372, system: "Other" },

  { id: "freq-hz", label: "Frequency", symbol: "Hz", dim: dimVec({ T: -1 }), factor: 1, system: "SI" },
  { id: "angle-rad", label: "Plane angle", symbol: "rad", dim: dimVec(), factor: 1, system: "SI" },
  { id: "angle-deg", label: "Plane angle", symbol: "°", dim: dimVec(), factor: Math.PI / 180, system: "Other" },
];

export interface ConversionResult {
  ok: boolean;
  value: number | null;
  error?: string;
}

export function convert(value: number, fromId: string, toId: string): ConversionResult {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  if (!from || !to) return { ok: false, value: null, error: "Unknown unit." };

  if (!dimsEqual(from.dim, to.dim)) {
    return {
      ok: false,
      value: null,
      error: `${from.symbol} is ${formatDim(from.dim)} but ${to.symbol} is ${formatDim(to.dim)} — these measure different things.`,
    };
  }

  const inBase = value * from.factor + (from.offset ?? 0);
  const result = (inBase - (to.offset ?? 0)) / to.factor;
  // 1 N -> 1e5 dynes arrives as 99999.99999999999 without this snap.
  return { ok: true, value: Number(result.toPrecision(15)) };
}

/** Groups the unit table by physical quantity so the converter can offer pairs. */
export function groupedUnits(): { label: string; units: UnitDef[] }[] {
  const groups = new Map<string, UnitDef[]>();
  for (const unit of UNITS) {
    const list = groups.get(unit.label) ?? [];
    list.push(unit);
    groups.set(unit.label, list);
  }
  return [...groups.entries()].map(([label, units]) => ({ label, units }));
}
