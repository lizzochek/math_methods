"use strict";

let A = [
  [11.39, 2.45, 3.35, 2.28],
  [5.31, 8.28, 0.98, 1.04],
  [2.25, 1.32, 6.58, 0.49],
  [3.81, 0.25, 1.28, 2.75],
];

let B = [12.48, 2.38, 8.47, 4.21];

function Seidel(A, B) {
  console.log("Matrixes at the beginning");
  console.log(A);
  console.log(B);
  let e = 0.000001;

  let x = [0, 0, 0, 0];
  let xPrev = [0, 0, 0, 0];
  let max;
  let step = 1;

  console.log("First assumption of results:");
  console.log(x);

  do {
    for (let i = 0; i < A.length; i++) {
      let q = 0;
      for (let j = 0; j < A.length; j++) {
        if (j !== i) {
          q += A[i][j] * x[j];
        }
      }
      x[i] = (1 / A[i][i]) * (B[i] - q);
    }

    let diff = [];
    for (let i = 0; i < x.length; i++) {
      diff[i] = x[i] - xPrev[i];
    }
    max = Math.max.apply(null, diff);
    xPrev = x.slice();

    console.log(`Results on a step ${step}`);
    console.log(x);
    step++;

    let Ax = multiplyMatrix(A, x);
    let r = MinusArrays(B, Ax);

    console.log("Checking results:");
    console.log(r);
  } while (max >= e);

  console.log("Final result:");
  console.log(x);
  return x;
}

function multiplyMatrix(A, B) {
  let rowsA = A.length;
  let colsA = A[0].length;
  let rowsB = B.length;
  let colsB;
  if (B[0].length === undefined) {
    colsB = 1;
  } else {
    colsB = B[0].length;
  }

  let C = [];

  if (colsA != rowsB) return false;

  for (let i = 0; i < rowsA; i++) C[i] = [];

  for (let k = 0; k < colsB; k++) {
    for (let i = 0; i < rowsA; i++) {
      let temp = 0;
      for (let j = 0; j < rowsB; j++) {
        if (colsB === 1) {
          temp += A[i][j] * B[j];
        } else {
          temp += A[i][j] * B[j][k];
        }
      }
      C[i][k] = temp;
    }
  }

  return C;
}

function MinusArrays(A, B) {
  let newArr = [];
  for (let i = 0; i < A.length; i++) {
    newArr[i] = A[i] - B[i];
  }
  return newArr;
}

Seidel(A, B);
