// Part B - Higher-Order Functions, Map, Set & Object methods

"use strict";

const cart = [
  { id: 101, name: "Laptop", price: 50000, qty: 1, category: "Electronics" },
  { id: 102, name: "Mouse", price: 800, qty: 2, category: "Accessories" },
  { id: 103, name: "Keyboard", price: 1500, qty: 1, category: "Accessories" },
  { id: 104, name: "Monitor", price: 12000, qty: 1, category: "Electronics" },
  { id: 105, name: "Headphones", price: 2500, qty: 2, category: "Accessories" },
];

// ---------------------------------------------------------------
// Task 1 - Array methods
// ---------------------------------------------------------------
console.log("----- Task 1: Array methods -----");

// map() -> name with total item price
const itemTotals = cart.map((item) => ({ name: item.name, total: item.price * item.qty }));
console.log("Item totals:", itemTotals);

// filter() -> products above 2000
const expensiveItems = cart.filter((item) => item.price > 2000);
console.log("Products above ₹2000:", expensiveItems.map((item) => item.name));

// reduce() -> total cart value
const cartValue = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log("Total cart value: ₹" + cartValue);

// forEach() -> just logs, returns nothing
cart.forEach((item) => {
  console.log(`${item.name} | ${item.category} | Qty: ${item.qty}`);
});

// combined -> total value of Electronics only
const electronicsTotal = cart
  .filter((item) => item.category === "Electronics")
  .reduce((sum, item) => sum + item.price * item.qty, 0);
console.log("Electronics total: ₹" + electronicsTotal);

/*
  Q1. map() vs forEach()
  map() returns a NEW array with the transformed values. forEach() only runs a function
  for every element and returns undefined.

  Q2. Does filter() change the original array?
  No. It returns a new array and the original stays the same.

  Q3. Why is reduce() useful for totals?
  It keeps an accumulator and combines all elements into one single value (sum, count,
  max, object etc.).

  Q4. Which method returns a new transformed array?
  map().
*/

// ---------------------------------------------------------------
// Task 2 - Map and Set
// ---------------------------------------------------------------
console.log("\n----- Task 2: Map and Set -----");

// A. Inventory using Map (key = product id)
const inventory = new Map();
cart.forEach((item) => inventory.set(item.id, { name: item.name, price: item.price, qty: item.qty }));

console.log("Get 101:", inventory.get(101));

// update quantity
const laptop = inventory.get(101);
laptop.qty = 5;
inventory.set(101, laptop);
console.log("After update, 101 qty:", inventory.get(101).qty);

// delete one
inventory.delete(103);
console.log("Has 103 after delete?", inventory.has(103));

// loop over all entries
for (const [id, details] of inventory) {
  console.log(id, "->", details.name, "| qty:", details.qty);
}

// B. Remove duplicates using Set
const emails = [
  "rahul@gmail.com",
  "priya@gmail.com",
  "rahul@gmail.com",
  "arjun@gmail.com",
  "priya@gmail.com",
];
const uniqueEmails = [...new Set(emails)];
console.log("Unique emails:", uniqueEmails);

/*
  Q1. Map vs plain object
  Map keys can be any type (objects, functions, numbers) while object keys are only
  strings/symbols. Map keeps insertion order, has a .size property and is made for
  frequent add/remove.

  Q2. Why is Set good for removing duplicates?
  A Set only stores unique values, so adding the same value again is ignored.

  Q3. Can a Map use an object as a key?
  Yes (the key is matched by reference).

  Q4. Does Set keep insertion order?
  Yes, it iterates in the order the values were inserted.
*/

// ---------------------------------------------------------------
// Task 3 - Object.freeze() vs Object.seal()
// ---------------------------------------------------------------
console.log("\n----- Task 3: freeze vs seal -----");

const productConfig = { name: "Laptop", price: 50000, stock: 20 };
const frozenConfig = { ...productConfig };
const sealedConfig = { ...productConfig };

Object.freeze(frozenConfig);
Object.seal(sealedConfig);

// strict mode is on, so illegal changes throw errors - try/catch shows them
function tryChanges(label, obj) {
  console.log(`--- ${label} ---`);
  try { obj.price = 45000; console.log("change price -> price is now", obj.price); }
  catch (err) { console.log("change price failed:", err.message); }

  try { obj.discount = 10; console.log("add property -> added"); }
  catch (err) { console.log("add property failed:", err.message); }

  try { delete obj.stock; console.log("delete property -> deleted"); }
  catch (err) { console.log("delete property failed:", err.message); }

  console.log("Final object:", obj);
}

tryChanges("Object.freeze()", frozenConfig);
tryChanges("Object.seal()", sealedConfig);

// nested objects are not frozen automatically
const nested = Object.freeze({ name: "Laptop", specs: { ram: "8GB" } });
nested.specs.ram = "16GB"; // works, freeze is shallow
console.log("Nested object after change:", nested);

/*
  Q1. freeze() vs seal()
  freeze(): cannot add, delete or change any property.
  seal(): cannot add or delete properties, but existing values CAN be changed.

  Q2. Can a property be changed after seal()?
  Yes, as long as it is an existing property.

  Q3. Are nested objects frozen automatically?
  No. Only the first level is frozen.

  Q4. What is shallow freezing?
  Only the top-level properties are locked. Objects inside are still reachable and
  editable, so for a deep freeze we have to freeze them recursively.
*/
