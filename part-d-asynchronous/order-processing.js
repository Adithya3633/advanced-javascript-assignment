// Part D - Asynchronous JavaScript

"use strict";

// small helper used everywhere
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------
// Task 1 - Event loop
// ---------------------------------------------------------------
function eventLoopDemo() {
  console.log("----- Task 1: Event loop -----");
  console.log("Order Started");
  setTimeout(() => console.log("Payment Processing"), 0);
  Promise.resolve().then(() => console.log("Payment Successful"));
  console.log("Order Completed");

  /*
    Output order:
      Order Started
      Order Completed
      Payment Successful      <- microtask
      Payment Processing      <- macrotask

    Q1. Why does the Promise callback run before setTimeout()?
    After the main code finishes, the event loop empties the microtask queue (promise
    callbacks) completely before taking the next macrotask (timer), even if the timer is 0 ms.

    Q2. Microtask vs macrotask queue
    Microtask queue: promise .then/.catch, queueMicrotask. Macrotask queue: setTimeout,
    setInterval, DOM events, I/O.

    Q3. Role of the call stack
    It tracks the function that is running now. JavaScript is single threaded so it runs
    one thing at a time from the stack, and async callbacks only run when the stack is empty.

    Q4. What does the event loop do?
    It keeps checking whether the call stack is empty. If it is, it moves the next task
    from the queues (microtasks first, then macrotasks) onto the stack.
  */
}

// ---------------------------------------------------------------
// Task 2 - Callbacks
// ---------------------------------------------------------------
function validateOrder(cb) {
  setTimeout(() => {
    console.log("Order Validated");
    cb();
  }, 1000);
}

function processPayment(cb) {
  setTimeout(() => {
    console.log("Payment Completed");
    cb();
  }, 1000);
}

function sendConfirmation(cb) {
  setTimeout(() => {
    console.log("Confirmation Sent");
    cb();
  }, 1000);
}

function runWithCallbacks(done) {
  console.log("\n----- Task 2: Callbacks -----");
  // nested callbacks - each step starts inside the previous one
  validateOrder(() => {
    processPayment(() => {
      sendConfirmation(() => {
        console.log("All steps finished (callbacks)");
        done();
      });
    });
  });

  /*
    Why is callback hell hard to maintain?
    The code keeps moving to the right (pyramid shape), it is hard to read, error handling
    must be repeated at every level, and adding/removing/reordering a step means
    changing the nesting everywhere.
  */
}

// ---------------------------------------------------------------
// Task 3 - Promises
// ---------------------------------------------------------------
const validateOrderPromise = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Order Validated");
      resolve();
    }, 1000);
  });

const processPaymentPromise = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Payment Completed");
      resolve();
    }, 1000);
  });

const sendConfirmationPromise = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("Confirmation Sent");
      resolve();
    }, 1000);
  });

function runWithPromises() {
  console.log("\n----- Task 3: Promises -----");
  return validateOrderPromise()
    .then(processPaymentPromise)
    .then(sendConfirmationPromise)
    .then(() => console.log("All steps finished (promises)"))
    .catch((error) => console.log("Order failed:", error));
}

// ---------------------------------------------------------------
// Task 4 - async / await
// ---------------------------------------------------------------
async function placeOrder() {
  console.log("\n----- Task 4: async/await -----");
  try {
    await validateOrderPromise();
    await processPaymentPromise();
    await sendConfirmationPromise();
    console.log("SUCCESS: Your order has been placed!");
  } catch (error) {
    console.log("FAILURE: Order could not be placed ->", error);
  }
}

// ---------------------------------------------------------------
// Task 5 - Promise combinators
// ---------------------------------------------------------------
const productsAPI = () =>
  new Promise((resolve) => setTimeout(() => resolve("Products Loaded"), 1000));

const paymentAPI = () =>
  new Promise((_, reject) => setTimeout(() => reject("Payment Service Failed"), 1500));

const deliveryAPI = () =>
  new Promise((resolve) => setTimeout(() => resolve("Delivery Loaded"), 2000));

async function runCombinators() {
  console.log("\n----- Task 5: Promise combinators -----");

  // all -> rejects as soon as one promise rejects
  try {
    const results = await Promise.all([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("all() results:", results);
  } catch (error) {
    console.log("all() failed ->", error);
  }

  // allSettled -> waits for everything and gives the status of each one
  const settled = await Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()]);
  console.log("allSettled() results:");
  settled.forEach((res, index) => {
    if (res.status === "fulfilled") console.log(`  API ${index + 1}: fulfilled -> ${res.value}`);
    else console.log(`  API ${index + 1}: rejected -> ${res.reason}`);
  });

  // race -> first one to settle (products at 1000 ms)
  try {
    const first = await Promise.race([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("race() winner:", first);
  } catch (error) {
    console.log("race() rejected ->", error);
  }

  // any -> first one that is successful
  try {
    const firstSuccess = await Promise.any([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("any() first success:", firstSuccess);
  } catch (error) {
    console.log("any() failed ->", error);
  }

  /*
    Q1. all() vs allSettled()
    all() rejects immediately when any promise rejects and we lose the other results.
    allSettled() always waits for all of them and reports status + value/reason for each.

    Q2. Does race() wait for success?
    No, it returns/rejects with whichever promise settles FIRST, success or failure.

    Q3. any() vs race()
    any() ignores rejections and waits for the first FULFILLED promise. race() takes the
    first settled one, even if it is a rejection.

    Q4. When every promise in any() rejects?
    It rejects with an AggregateError that has an errors array with all the reasons.
  */
}

// run everything one after another
async function main() {
  eventLoopDemo();
  await wait(100); // let the event loop demo finish first
  await new Promise((resolve) => runWithCallbacks(resolve));
  await runWithPromises();
  await placeOrder();
  await runCombinators();
}

main();
