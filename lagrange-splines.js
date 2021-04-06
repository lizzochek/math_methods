"use strict";

let interpolationNodes = [3, 5, 7, 9, 11];
let numberOfNodes = interpolationNodes.length;
const f = (x) => Math.sin(2 * x) + (4 * x) ** (1 / 3);
let fx = interpolationNodes.map(f);

console.log("----LAGRANGE INTERPOLATION----");

function Lagrange(n, x, y) {
  console.log(`Interpolation nodes: ${x}`);
  console.log(`Function values: ${y}`);

  //Polynomial to be
  let Lx = "";

  for (let i = 0; i < n; i++) {
    console.log(`Step ${i + 1}`);

    let P = 1;
    let xx = ``;

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        //x expression
        xx += `(x - ${x[j]})`;
        //coefficient
        P = P / (x[i] - x[j]);
      }
    }

    P = P * y[i];
    P = P.toFixed(4);
    P += xx;
    Lx += ` + ${P}`;
    console.log(`Lx: ${Lx}`);
  }
  console.log(`Final polynomial`);
  console.log(`Lx = ${Lx}`);
}
Lagrange(numberOfNodes, interpolationNodes, fx);

//Cubic spline interpolation
console.log("----CUBIC SPLINE INTERPOLATION----");

function cubicInterpolation(y, x) {
  //First coefficient
  let a = fx.slice(0, -1);
  console.log(`ai = yi`);
  console.log(a);

  //Additional values
  let h = x[1] - x[0];
  let equals = new Array(y.length).fill(0);
  for (let i = 1; i < equals.length - 1; i++)
    equals[i] = (6 * (y[i + 1] - y[i] - y[1] + y[i - 1])) / h;

  //Array of the values after 0
  let equal = equals.slice(1, 4);
  console.log(`----c0 = cn = 0, so we get the system:----`);
  console.log(
    `8c1 + 2c2 = ${equal[0]}\n2c1 + 8c2 + 2c3 = ${equal[1]}\n2c2 + 8c3 = ${equal[2]}`
  );

  //Counting coefficients
  let A = [
    [8, 2, 0],
    [2, 8, 2],
    [0, 2, 8],
  ];
  let c = sweep(A, equal);
  c.push(0);
  c.unshift(0);
  console.log(`----ci:----`);
  console.log(c);

  let d = [];
  for (let i = 1; i < c.length; i++) d.push((c[i] - c[i - 1]) / h);
  console.log(`----di:----`);
  console.log(d);
  let b = [];
  for (let i = 1; i < c.length; i++)
    b.push(c[i] - (h ** 2 / 6) * d[i - 1] + (y[i] - y[i - 1]) / h);
  console.log(`----bi:----`);
  console.log(b);

  //Creating a final spline
  console.log(`----Splines----`);
  for (let i = 0; i < b.length; i++) {
    console.log(
      `F${i + 1} = ${a[i].toFixed(6)} + ${b[i].toFixed(6)}(x - ${x[i]}) + ${(
        c[i] / 2
      ).toFixed(6)}(x - ${x[i]})^2 + ${(d[i] / 6).toFixed(6)}(x - ${x[i]})^3`
    );
  }
}

//Solving matrix for ci
function sweep(matrix, d) {
  let a = [];
  let b = [];
  let c = [];
  let A = [];
  let B = [];
  let x = [];

  a[0] = 0;
  c[matrix.length - 1] = 0;

  //Filling a, b, c
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = 0; j < matrix.length - 1; j++) {
      a[i + 1] = matrix[i + 1][i];
      c[i] = matrix[i][i + 1];
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) b[i] = matrix[i][i];
  }

  //Finding coefficients
  A[0] = -c[0] / b[0];
  B[0] = d[0] / b[0];
  for (let i = 1; i < matrix.length; i++) {
    let e = a[i] * A[i - 1] + b[i];
    A[i] = -c[i - 1] / e;
    B[i] = (d[i] - a[i] * B[i - 1]) / e;
  }

  //Logging
  console.log(`Sweeping coefficients:`);
  console.log(A);
  console.log(B);

  //Reversed way
  x[matrix.length - 1] = B[matrix.length - 1];
  for (let i = matrix.length - 2; i >= 0; i--) {
    x[i] = A[i] * x[i + 1] + B[i];
  }

  console.log(`----The sweeped array:----`);
  console.log(x);
  return x;
}
cubicInterpolation(fx, interpolationNodes);

//Finding errors for Lagrange
let arg = [];
let fx1 = [];
let pn = [];
let E = [];
let res;
let res1;
let res2;

const errorsLagrange = (arr1, arr2, arr3) => {
  for (let i = 0; i < 21; i++) {
    res = (0.4 * i).toFixed(1);
    arr1.push(res);
    res1 = (Math.sin(2 * res) + Math.cbrt(4 * res)).toFixed(6);
    arr2.push(res1);
    res2 = (
      0.02561 * Math.pow(res, 4) -
      0.405725 * Math.pow(res, 3) +
      1.88329 * Math.pow(res, 2) -
      1.93326 * res
    ).toFixed(6);
    arr3.push(res2);
    E.push(Math.abs(res2 - res1).toFixed(6));
  }
};

errorsLagrange(arg, fx1, pn);
console.log("Errors Lagrange");
console.log(E);

const errorSpline = (x, y) => {
  console.log("Spline errors");
  const func1 = (x) =>
    2.01 + 0.691 * (x - 2) + 0.076 * (x - 2) * (x - 2) * (x - 2);
  const func2 = (x) =>
    2.17 +
    0.489 * (x - 4) -
    0.458 * (x - 4) * (x - 4) -
    0.169 * (x - 4) * (x - 4) * (x - 4);
  const func3 = (x) =>
    4.027 -
    0.218 * (x - 6) -
    0.559 * (x - 6) * (x - 6) +
    0.205 * (x - 6) * (x - 6) * (x - 6);
  const func4 = (x) =>
    2.551 +
    0.932 * (x - 8) +
    0.6698 * (x - 8) * (x - 8) -
    0.112 * (x - 8) * (x - 8) * (x - 8);
  const funcs = [func1, func2, func3, func4];
  const errors = [];
  for (let i = 0; i < y.length; i++) {
    const curr = x[i];
    const diff = 0.3;
    for (let j = 0; j < 6; j++) {
      const res =
        i >= y.length - 2
          ? funcs[y.length - 2](curr + diff * j)
          : funcs[i](curr + diff * j);
      errors.push(res - f(curr + diff * j));
    }
  }
  console.log(errors);
  return errors;
};

errorSpline(interpolationNodes, fx);
