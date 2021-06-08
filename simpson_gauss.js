"use strict";

//Исходные условия задачи
const e = 0.0001;
const fx = (x) => +(Math.cos(x) / (x + 1));
const a = 0.1;
const b = 1.1;

//Заготавливаем производные, которые понадобятся в расчетах
const fourDeriv = (x) =>
  (-3 * Math.sin(x) * (x + 1) - 6 * Math.cos(x)) / (x + 1) ** 3 -
  (6 * Math.cos(x) * (x + 1) - 18 * Math.sin(x)) / (x + 1) ** 4 +
  (Math.cos(x) * (x + 1) - Math.sin(x)) / (x + 1) ** 2 +
  (6 * Math.sin(x) * (x + 1) + 24 * Math.cos(x)) / (x + 1) ** 5;

const sixDeriv = (x) =>
  +(
    (6 * Math.sin(x)) / (x + 1) -
    Math.cos(x) +
    (30 * Math.cos(x)) / (x + 1) ** 2 -
    (120 * Math.sin(x)) / (x + 1) ** 3 -
    (360 * Math.cos(x)) / (x + 1) ** 4 +
    (720 * Math.sin(x)) / (x + 1) ** 5 +
    (720 * Math.cos(x)) / (x + 1) ** 6
  ) /
  (x + 1);

//Вычисление факториала
const factorial = (n) => (n != 1 ? n * factorial(n - 1) : 1);

const Simpson = (fx, a, b, e) => {
  console.log("----- SIMPSON'S FORMULA-----");
  console.log(
    `The fourth derivative of the current function falls monotonously \nTherefore the maximum is at point a = ${a}`
  );

  //Находим погрешность и минимальное количество необходимых шагов
  let max = fourDeriv(0.1);
  console.log(`The maximum M = ${max}`);
  let err = ((b - a) ** 5 * max) / 180;
  let n = 2 * Math.ceil((err / e) ** 0.25);
  console.log(`Minimum number of steps: ${n / 2}`);

  //Выбираем число шагов и предельную абсолютную ошибку
  console.log(`Number of steps we choose: n = ${n}`);
  err = err / n ** 4;
  console.log(`Marginal absolute error: ${err}`);

  //Проверяем точность вычислений
  if (err <= e) {
    //Шаг узлов
    let h = 1 / n;
    console.log(`Step: h = ${h}`);

    //Готовим массивы для значений
    let x = new Array(n + 1).fill(0);
    let y = new Array(n + 1).fill(0);

    //Заполняем значения узлов с учетом шага и значения функции
    x.forEach((cur, i) => (x[i] = +(0.1 + h * i)));
    y = x.map(fx);

    //Вывод в консоль
    console.log(`Nodes:`);
    x.forEach((cur, i) => console.log(cur.toFixed(1)));
    console.log(`Function values:`);
    y.forEach((cur, i) => console.log(cur.toFixed(4)));

    //Расчет интеграла по формуле
    let I =
      (h / 3) *
      (y[0] +
        y[10] +
        4 * (y[1] + y[3] + y[5] + y[7] + y[9]) +
        2 * (y[2] + y[4] + y[6] + y[8]));
    console.log(`The result: I = ${I.toFixed(6)}`);
    //Вариант неправильного выбора n и слишком большой погрешности
  } else return console.log("n was chosen incorrectly ");
};

const Gauss = (fx, a, b, e) => {
  console.log("-----GAUSS'S FORMULA-----");
  console.log(
    `Six derivative false monotonously on the given function falls monotonously on the section\nTherefore the maximum is at point a = ${a}`
  );

  // Предполагаем, что n = 3
  const n = 3;
  //Находим погрешность при n = 3 по формуле
  const maxDeriv = sixDeriv(a);
  const err =
    (maxDeriv * factorial(n) ** 4 * (b - a) ** (2 * n + 1)) /
    ((2 * n + 1) * factorial(2 * n) ** 3);
  console.log(`Actual error: ${err}`);

  if (err < e) {
    let t = [-0.774597, 0, 0.774597];
    let A = [0.55555, 0.888889, 0.55555];

    //Делаем замену x = 0.6 + 0.5t и получаем функцию:
    const ft = (t) => +(Math.cos(0.6 + 0.5 * t) / (0.5 * t + 1.6));
    let functT = t.map(ft);
    console.log(`Function values for t: ${functT}`);

    //Умножаем коэффициенты на значения функции и находим интеграл
    let I = 0;
    for (let i = 0; i < n; i++) {
      I += ((b - a) * A[i] * functT[i]) / 2;
    }
    console.log(`Integral value: ${I}`);
  }
};

Simpson(fx, a, b, e);
Gauss(fx, a, b, e);
