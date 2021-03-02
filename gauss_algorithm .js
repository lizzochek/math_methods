"use strict"

//Matrix of x coefficient
let A = [
    [8.3, 2.7, 4.1, 1.9],
    [3.92, 8.45, 7.98, 2.46],
    [3.77, 8.01, 8.04, 2.28],
    [2.21, 2.85, 1.69, 6.99]
];

//Matrix of the values
let B = [-9.85, 12.21, 14.65, -8.35];

//The general Gauss's algorithm
function Gauss(A, B) {
    //The main cycle 
    for (let p = 0; p < A.length; p++) {

        //Finding the maximum element
        let max = p;
        for (let i = p + 1; i < A.length; i++) {
            if (Math.abs(A[i][p]) > Math.abs(A[max][p])) {
                max = i;
            }
        }

        //Changing the rows according to the main element
        let temp = A[p];
        A[p] = A[max];
        A[max] = temp;
        let t = B[p];
        B[p] = B[max];
        B[max] = t;

        //Logging the new matrix
        console.log(`Renumerated matrix:`);
        console.log(A);
        console.log(B);

        //Getting the first row normalized 
        let current = A[p][p];
        B[p] = B[p] / A[p][p];

        for (let q = 0; q < A.length; q++) {
            A[p][q] = A[p][q] / current;
        }

        //Changing all the other rows
        for (let i = p + 1; i < A.length; i++) {
            let m = A[i][p] / A[p][p];
            B[i] = B[i] - B[p] * m;
            for (let j = 0; j < A.length; j++) {
                A[i][j] = A[i][j] - A[p][j] * m;
            }
        }

        //The final matrix of the step
        console.log(`Step ${p + 1} matrixes`);
        console.log(A, B);
    }

    //Final matrixes after the Gauss algorithm
    console.log(`Final matrixes:`);
    console.log(A);
    console.log(B);

    //Reverse way
    let x = new Array(A.length);
    for (let i = A.length - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < A.length; j++) {
            sum += A[i][j] * x[j];
        }
        x[i] = (B[i] - sum) / A[i][i];
    }

    //Logging the results
    console.log('The resuls:');
    for (let j = 0; j < x.length; j++) {
        console.log(`x${j + 1} = ${x[j]}`);
    }

    //  console.log(x);
    return x;

};


let x = Gauss(A, B);
console.log(x);