// Part C - JSON handling & output based debugging

"use strict";

// ---------------------------------------------------------------
// Task 1 - JSON.stringify() and JSON.parse()
// ---------------------------------------------------------------
console.log("----- Task 1: stringify and parse -----");

const order = {
  orderId: 501,
  customer: "Rahul",
  deliveryDate: undefined,
  discount: null,
  amount: 5000,
  calculateTax: function () {
    return this.amount * 0.1;
  },
};

const jsonString = JSON.stringify(order);
console.log("JSON string:", jsonString);

const parsedOrder = JSON.parse(jsonString);
console.log("Parsed back:", parsedOrder);

// check which properties were lost
const lostProperties = Object.keys(order).filter((key) => !(key in parsedOrder));
console.log("Lost properties:", lostProperties); // [ 'deliveryDate', 'calculateTax' ]

/*
  Result: deliveryDate (undefined) and calculateTax (function) are lost.
  discount: null is kept because null is a valid JSON value.

  Why do functions and undefined behave differently?
  JSON is only a data format and has no type for undefined or functions. So
  stringify() skips them in objects. In arrays they become null so the index positions
  do not shift. null IS part of JSON so it stays.
*/

// ---------------------------------------------------------------
// Task 2 - Predict the output
// ---------------------------------------------------------------
console.log("\n----- Task 2: Predict the output -----");

// Q1 -> {"name":"Rahul"}   (undefined property is skipped)
console.log("Q1:", JSON.stringify({ name: "Rahul", age: undefined }));

// Q2 -> [10,null,30]   (undefined inside array becomes null)
console.log("Q2:", JSON.stringify([10, undefined, 30]));

// Q3 -> {"price":null,"discount":null}   (NaN and Infinity are not valid JSON numbers)
console.log("Q3:", JSON.stringify({ price: NaN, discount: Infinity }));

// Q4 -> SyntaxError (keys and strings must use double quotes)
try {
  console.log("Q4:", JSON.parse("{name: 'Rahul', age: 25}"));
} catch (error) {
  console.log("Q4: " + error.name + " ->", error.message);
}

// Q5 -> TypeError: Converting circular structure to JSON
try {
  const user = { name: "Rahul" };
  user.self = user;
  console.log("Q5:", JSON.stringify(user));
} catch (error) {
  console.log("Q5: " + error.name + " ->", error.message.split("\n")[0]);
}

// Q6 -> {"createdAt":"2026-01-01T00:00:00.000Z"}   (Date has toJSON() which gives an ISO string)
console.log("Q6:", JSON.stringify({ createdAt: new Date("2026-01-01") }));
