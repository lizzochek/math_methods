"use strict";

const fxy = (x, y) => Math.exp(-2.6 * x) * (y ** 2 + 2.6);
const interval = [0, 4];
const h = 0.1;
const y0 = 0;

//Helper functions
function Display(x, y, values, k, deltaY, err) {
  this.x = x;
  this.y = y;
  this.values = values;
  this.k = k;
  this.deltaY = deltaY;
  this.err = err;
}

const xForInterval = (h) => {
  const arr = new Array((interval[1] - interval[0]) / h)
    .fill(0)
    .map((cur, i, arr) => (arr[i + 1] = +(arr[i] + h).toFixed(2)));
  arr.unshift(0);
  return arr;
};

const RungeKutta = (fxy, y0, interval, h) => {
  console.log("\n-----RUNGE-KUTTA METHOD STARTED-----\n");
  const n = (interval[1] - interval[0]) / h;

  const x = new Array(4);
  const y = new Array(4);

  const functionValues = new Array(4);
  const k = new Array(4);

  const finalY = new Array(n);

  finalY[0] = y0;

  x[0] = interval[0];
  y[0] = y0;

  console.log(`Starter values: x = ${x[0]}, y = ${y[0]}, step = ${h}`);

  for (let i = 0; i < n; i++) {
    functionValues[0] = fxy(x[0], y[0]);
    k[0] = h * functionValues[0];

    x[1] = x[0] + h / 2;
    y[1] = y[0] + k[0] / 2;
    functionValues[1] = fxy(x[1], y[1]);
    k[1] = h * functionValues[1];

    x[2] = x[0] + h / 2;
    y[2] = y[0] + k[1] / 2;
    functionValues[2] = fxy(x[2], y[2]);
    k[2] = h * functionValues[2];

    x[3] = x[0] + h;
    y[3] = y[0] + k[1] / 2;
    functionValues[3] = fxy(x[3], y[3]);
    k[3] = h * functionValues[3];

    let deltaY = (1 / 6) * (k[0] + 2 * k[1] + 2 * k[2] + k[3]);
    let err = Math.abs((k[1] - k[2]) / (k[0] - k[1]));

    //let display = new Display(x, y, functionValues, k, deltaY, err);
    //console.table(display);

    //if (err < 0.09) console.log(`Error is suitable to go on`);
    if (err > 0.09) {
      h = h / 2;
    }
    finalY[i + 1] = y[0] + deltaY;

    x[0] = x[3];
    y[0] = finalY[i + 1];
  }
  console.log(`Returning x values`);
  console.log(xForInterval(h));

  console.log(`Returning y values`);
  console.table(finalY);

  console.log("\n-----RUNGE-KUTTA METHOD FINISHED-----\n");
  return finalY;
};

const Addams = (xFound, yFound, fxy, h) => {
  console.log("\n-----ADDAMS METHOD STARTED-----\n");

  const n = (interval[1] - interval[0]) / h;

  const y = yFound.slice(0, 4).concat(new Array(n - 4).fill(0));
  for (let i = 3; i < n; i++) {
    y[i + 1] =
      y[i] +
      (h / 24) *
        (55 * fxy(xFound[i], y[i]) -
          59 * fxy(xFound[i - 1], y[i - 1]) +
          37 * fxy(xFound[i - 2], y[i - 2]) -
          9 * fxy(xFound[i - 3], y[i - 3]));
  }

  console.log(`Returning y values`);
  console.table(y);

  let yBetter = [...y];

  for (let i = 3; i < n; i++) {
    yBetter[i + 1] =
      y[i] +
      (h / 24) *
        (9 * fxy(xFound[i + 1], yBetter[i + 1]) +
          19 * fxy(xFound[i], yBetter[i]) -
          5 * fxy(xFound[i - 1], yBetter[i - 1]) +
          fxy(xFound[i - 2], yBetter[i - 2]));
  }
  console.log(`Returning refined y values`);
  console.table(yBetter);

  console.log("\n-----ADDAMS METHOD FINISHED-----\n");
  return yBetter;
};

const yRunge = RungeKutta(fxy, y0, interval, h);
const yHalfInterval = RungeKutta(fxy, y0, interval, h / 2);

const yAddams = Addams(xForInterval(h), yRunge, fxy, h);
const yHalfIntervalAddams = Addams(xForInterval(h / 2), yRunge, fxy, h / 2);

let errRunge = new Array(yRunge.length).fill(0).map((el, i) => {
  return (el = Math.abs((yRunge[i] - yHalfInterval[i * 2]) / (2 ** 4 - 1)));
});

let errAddams = new Array(yAddams.length).fill(0).map((el, i) => {
  return (el = Math.abs(
    (yAddams[i] - yHalfIntervalAddams[i * 2]) / (2 ** 4 - 1)
  ));
});

console.log(`-----ERROR FUNCTION FOR RUNGE METHOD----- `);
console.table(errRunge);

console.log(`-----ERROR FUNCTION FOR ADDAMS METHOD----- `);
console.table(errAddams);
