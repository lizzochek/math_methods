"use strict";

const fx = (x) => 2 * x ** 4 - x ** 3 - 5 * x ** 2 + 2 * x - 4;
const derivative1 = (x) => 8 * x ** 3 - 3 * x ** 2 - 10 * x + 2;
const derivative2 = (x) => 24 * x ** 2 - 6 * x - 10;
const a1 = -2.58;
const b1 = -0.3876;

const a2 = 0.3876;
const b2 = 2.58;

const e = 0.0001;

function bisection(a, b, f, e) {
  let numberOfIterations = 0;
  while (true) {
    numberOfIterations++;
    let x = (a + b) / 2;
    let fx = f(x);

    console.log(`Iteration: ${numberOfIterations}`);
    console.log(`Current x: ${x}, current segment: [${a}; ${b}]`);

    if (fx === 0) {
      console.log(`Number of iterations: ${numberOfIterations}`);
      console.log(`Root of the equation: ${x}`);
      return x, numberOfIterations;
    } else {
      let fa = f(a);
      fa * fx < 0 ? (b = x) : (a = x);
      if (Math.abs(b - a) < e) {
        console.log(`Number of iterations: ${numberOfIterations}`);
        console.log(`Root of the equation: ${x}`);
        return [x, numberOfIterations];
      }
    }
  }
}

function chords(a, b, f, der1, der2, e) {
  let x0;
  let xPrev;
  let xNext;
  let numberOfIterations = 0;

  let xRandom = Math.random() * (b - a) + a;
  let f1 = der1(xRandom);
  let f2 = der2(xRandom);
  if (f1 * f2 > 0) {
    x0 = b;
    xNext = a;
  } else {
    x0 = a;
    xNext = b;
  }
  xPrev = x0;

  while (true) {
    numberOfIterations++;
    console.log(`Iteration: ${numberOfIterations}`);
    console.log(`Current x: ${x0}, next x: ${xNext}`);

    xNext = xNext - (f(xNext) * (xNext - x0)) / (f(xNext) - f(x0));

    if (Math.abs(xNext - xPrev) < e) {
      console.log(`Number of iterations: ${numberOfIterations}`);
      console.log(`Root of the equation: ${xNext}`);
      return [xNext, numberOfIterations];
    } else {
      xPrev = xNext;
    }
  }
}

function Newton(a, b, f, der1, der2, e) {
  let x0;
  let xPrev;
  let xNext;
  let numberOfIterations = 0;

  let xRandom = Math.random() * (b - a) + a;
  let f1 = der1(xRandom);
  let f2 = der2(xRandom);
  f1 * f2 > 0 ? (x0 = b) : (x0 = a);
  xPrev = x0;

  while (true) {
    numberOfIterations++;
    console.log(`Iteration: ${numberOfIterations}`);
    console.log(`Current x: ${x0}, next x: ${xNext}`);

    xNext = xPrev - f(xPrev) / der1(xPrev);

    if (Math.abs(xNext - xPrev) < e) {
      console.log(`Number of iterations: ${numberOfIterations}`);
      console.log(`Root of the equation: ${xNext}`);
      return [xNext, numberOfIterations];
    } else {
      xPrev = xNext;
    }
  }
}

console.log("-----BISECTION-----");
console.log("-----ROOT 1-----");
const [x1, iterationsBisect1] = bisection(a1, b1, fx, e);
console.log("-----ROOT 2-----");
const [x2, iterationsBisect2] = bisection(a2, b2, fx, e);
const rootsBisect = [x1, x2];
console.log(`ROOTS FOUND WITH BISECTION METHOD: [${rootsBisect}]`);

console.log("-----CHORDS-----");
console.log("-----ROOT 1-----");
const [x3, iterationsChords1] = chords(a1, b1, fx, derivative1, derivative2, e);
console.log("-----ROOT 2-----");
const [x4, iterationsChords2] = chords(a2, b2, fx, derivative1, derivative2, e);
const rootsChords = [x3, x4];
console.log(`ROOTS FOUND WITH CHORDS METHOD: [${rootsChords}]`);

console.log("-----NEWTON-----");
console.log("-----ROOT 1-----");
const [x5, iterationsNewton1] = Newton(a1, b1, fx, derivative1, derivative2, e);
console.log("-----ROOT 2-----");
const [x6, iterationsNewton2] = Newton(a2, b2, fx, derivative1, derivative2, e);
const rootsNewton = [x5, x6];
console.log(`ROOTS FOUND WITH NEWTON METHOD: [${rootsNewton}]`);

console.log(`-----CHECKING RESULTS-----`);
console.log(
  `Number of iterations in bisection: ${iterationsBisect1}, ${iterationsBisect2}`
);
console.log(`Roots in bisection: ${x1}, ${x2}`);
console.log(
  `Number of iterations in chords method: ${iterationsChords1}, ${iterationsChords2}`
);
console.log(`Roots in chords method: ${x3}, ${x4}`);
console.log(
  `Number of iterations in Newton's method: ${iterationsNewton1}, ${iterationsNewton2}`
);
console.log(`Roots in Newton's method': ${x5}, ${x6}`);
