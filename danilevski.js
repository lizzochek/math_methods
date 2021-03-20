"use strict";

const A = [
  [7.25, 0.62, 1.45, 1.105],
  [0.62, 3.17, 1.3, 0.16],
  [1.45, 1.3, 6.43, 2.1],
  [1.105, 0.16, 2.1, 5.11],
];

function CreatePartMatrix(matrix, part) {
  const newMatrix = [];
  for (let i = 0; i < part; i++) {
    let row = matrix[i].slice(0, i + 1);
    newMatrix[i] = row;
  }
  return newMatrix;
}

function CreateIdentityMatrix(length) {
  const E = new Array(length);
  for (let i = 0; i < E.length; i++) {
    E[i] = new Array(length).fill(0);
    E[i][i] = 1;
  }
  return E;
}

function CreateFrobeniusMatrix(firstRow) {
  const C = [];
  C[0] = firstRow;
  for (let i = 1; i < firstRow.length; i++) {
    C[i] = new Array(firstRow.length).fill(0);
    C[i][i - 1] = 1;
  }
  return C;
}

function Swap(matrix, fromRow, toRow) {
  //Swap raws
  let temp = matrix[fromRow];
  matrix[fromRow] = matrix[toRow];
  matrix[toRow] = temp;

  //Swap columns
  for (let i = 0; i < matrix.length; i++) {
    let t = matrix[i][fromRow];
    matrix[i][fromRow] = matrix[i][toRow];
    matrix[i][toRow] = t;
  }
  return matrix;
}

function CreateMiddleMatrix(values, row) {
  const M = [];
  M[row] = values;

  for (let i = 0; i < values.length; i++) {
    if (i !== row) {
      M[i] = new Array(values.length).fill(0);
      M[i][i] = 1;
    }
  }

  return M;
}

function findZeroLeft(row, column, matrix) {
  let nonZero = false;
  for (let l = column - 1; l >= 0; l--) {
    if (matrix[row][l]) {
      nonZero = matrix[row][l];
      return [nonZero, l];
    }
  }
  return nonZero;
}

function multiplyMatrix(A, B) {
  let n = A.length,
    C = [];

  for (let i = 0; i < n; i++) C[i] = [];
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      let t = 0;
      for (let j = 0; j < n; j++) t += A[i][j] * B[j][k];
      C[i][k] = t;
    }
  }
  return C;
}

function displayMatrix(matrix) {
  let e = Math.pow(10, -10);
  for (const row of matrix) {
    let rowStr = "";
    for (const el of row) {
      rowStr += Math.abs(el) < e ? 0 : el;
      rowStr += "\t";
    }
    console.log(rowStr);
  }
}

function Danilevski(A) {
  console.log("Matrix at the beginning");
  console.log(A);

  let m = A.length;

  //The main cycle
  for (let i = 2; i <= A.length; i++) {
    console.log(`STEP ${i - 1}`);
    console.log("Current matrix");
    console.log(A);

    //Checking the main element
    if (A[m - i + 1][m - i]) {
      //Creating matrixes M and M^-1
      let M = CreateIdentityMatrix(A.length);
      let inverseM = CreateIdentityMatrix(A.length);
      for (let j = 0; j < m; j++) {
        if (j !== m - i) {
          M[m - i][j] = -A[m - i + 1][j] / A[m - i + 1][m - i];
        } else {
          M[m - i][j] = 1 / A[m - i + 1][m - i];
        }
        inverseM[m - i][j] = A[m - i + 1][j];
      }

      //Logging and multiplication
      console.log("Matrix M");
      console.log(M);
      console.log("Matrix M^-1");
      console.log(inverseM);
      let temp = multiplyMatrix(A, M);
      A = multiplyMatrix(inverseM, temp);
      console.log("M^-1 * A * M");
      console.log(A);
    } else {
      //Serching for a non-zero element on the left
      let arr = findZeroLeft(m - i + 1, m - i, A);
      console.log(arr);
      let nonZero = arr[0];
      let l = arr[1];
      if (nonZero) {
        Swap(A, m - i, l);
        i--;
      } else {
        //If all left elements are zero
        let B = CreatePartMatrix(A, m - i);
        let C = CreateFrobeniusMatrix(A[m - i + 1]);
        console.log(B);
        console.log(C);
        let frobeniusB = Danilevski(B);
        console.log(frobeniusB);

        //Returning resulting equation
        return console.log(
          `(λ^${A.length} + ${B[0][0]} λ^${A.length - 1} + ${B[0][1]} λ^${
            A.length - 2
          } + ${B[0][2]} λ^${A.length - 3} + ${B[0][3]}) * ( λ^${A.length} + ${
            C[0][0]
          } λ^${C.length - 1} + ${C[0][1]} λ^${A.length - 2} + ${C[0][2]} λ^${
            A.length - 3
          } + ${C[0][3]} = 0`
        );
      }
    }
  }

  //Display the results
  console.log("Final matrix");
  displayMatrix(A);
  console.log("Equation to find matrix eigenvalues");
  console.log(
    `λ^${A.length} + ${A[0][0]} λ^${A.length - 1} + ${A[0][1]} λ^${
      A.length - 2
    } + ${A[0][2]} λ^${A.length - 3} + ${A[0][3]} = 0`
  );
  return;
}

Danilevski(A);
