// Part E - Performance Optimization & DOM Events

"use strict";

// ---------------------------------------------------------------
// Task 1 - Debouncing
// ---------------------------------------------------------------
// runs the callback only after the user stops calling it for "delay" ms
function debounce(callback, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId); // cancel the earlier pending call
    timerId = setTimeout(() => callback.apply(this, args), delay);
  };
}

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const keyCountEl = document.getElementById("keyCount");
const searchCountEl = document.getElementById("searchCount");

const allProducts = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones", "Webcam", "Speaker", "Router"];
let keyCount = 0;
let searchCount = 0;

function searchProducts(text) {
  searchCount++;
  searchCountEl.textContent = searchCount;
  const query = text.trim().toLowerCase();
  const matches = query
    ? allProducts.filter((name) => name.toLowerCase().includes(query))
    : [];

  searchResults.innerHTML = "";
  if (query && matches.length === 0) {
    searchResults.innerHTML = "<li>No products found</li>";
    return;
  }
  matches.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    searchResults.appendChild(li);
  });
}

const debouncedSearch = debounce(searchProducts, 500);

searchInput.addEventListener("input", (event) => {
  keyCount++;
  keyCountEl.textContent = keyCount;
  debouncedSearch(event.target.value);
});

// ---------------------------------------------------------------
// Task 2 - Throttling
// ---------------------------------------------------------------
// runs the callback at most once in every "delay" ms
function throttle(callback, delay) {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= delay) {
      lastRun = now;
      callback.apply(this, args);
    }
  };
}

const scrollEventsEl = document.getElementById("scrollEvents");
const scrollRunsEl = document.getElementById("scrollRuns");
let scrollEvents = 0;
let scrollRuns = 0;

const handleScroll = () => {
  scrollRuns++;
  scrollRunsEl.textContent = scrollRuns;
  console.log("Throttled scroll handler ran at", new Date().toLocaleTimeString());
};
const throttledScroll = throttle(handleScroll, 1000);

window.addEventListener("scroll", () => {
  scrollEvents++;
  scrollEventsEl.textContent = scrollEvents;
  throttledScroll();
});

/*
  Q1. Debounce vs throttle
  Debounce waits until the events STOP for some time and then runs once.
  Throttle runs the function at a fixed rate (at most once per interval) while events continue.

  Q2. Which suits search suggestions?  Debounce - we want to search after the user finishes typing.

  Q3. Which suits scroll and resize?   Throttle - we want regular updates while it keeps firing.
*/

// ---------------------------------------------------------------
// Task 3 - Memoization
// ---------------------------------------------------------------
function calculateDiscount(price, percentage) {
  return price - (price * percentage) / 100;
}

// wrapper keeps the cache in a closure
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return { value: cache[key], source: "cache" };
    }
    const value = fn(...args);
    cache[key] = value;
    return { value, source: "fresh calculation" };
  };
}

const memoizedDiscount = memoize(calculateDiscount);

const priceInput = document.getElementById("priceInput");
const percentInput = document.getElementById("percentInput");
const calcResult = document.getElementById("calcResult");
const calcLog = document.getElementById("calcLog");

document.getElementById("calcBtn").addEventListener("click", () => {
  const price = Number(priceInput.value);
  const percentage = Number(percentInput.value);

  if (Number.isNaN(price) || Number.isNaN(percentage)) {
    calcResult.textContent = "Please enter valid numbers";
    return;
  }

  const { value, source } = memoizedDiscount(price, percentage);
  const message = `Price ${price}, discount ${percentage}% => ₹${value} (from ${source})`;
  calcResult.textContent = `Final price: ₹${value}`;
  console.log(message);

  const li = document.createElement("li");
  li.textContent = message;
  calcLog.appendChild(li);
});

/*
  Q1. What is memoization?  Caching the result of a function for given arguments.
  Q2. How does it improve performance?  Same inputs return the saved result, so the
      calculation is not repeated.
  Q3. Role of closures?  The returned function still remembers the "cache" object from
      memoize() even after memoize has finished, so the cache stays private and persistent.
*/

// ---------------------------------------------------------------
// Task 4 - Event bubbling and delegation
// ---------------------------------------------------------------

// (a) bubbling: click on a button -> li -> ul handlers all run
const bubbleList = document.getElementById("bubbleList");
const bubbleLog = document.getElementById("bubbleLog");
const stopCheck = document.getElementById("stopCheck");

function addBubbleLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  bubbleLog.appendChild(li);
}

bubbleList.querySelectorAll(".bubble-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    addBubbleLog("Button clicked");
    if (stopCheck.checked) {
      event.stopPropagation(); // parent will not get the event now
      addBubbleLog("stopPropagation() called - parent handler skipped");
    }
  });
});

bubbleList.addEventListener("click", (event) => {
  addBubbleLog(`Parent <ul> handler ran (target: ${event.target.tagName}, currentTarget: ${event.currentTarget.tagName})`);
});

// (b) delegation: ONE listener on the parent
const productList = document.getElementById("productList");

productList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".remove-btn");
  if (!removeBtn) return; // click was somewhere else
  removeBtn.parentElement.remove();
});

// adding new products dynamically - they work without adding new listeners
let nextId = 4;
document.getElementById("addBtn").addEventListener("click", () => {
  const li = document.createElement("li");
  li.dataset.id = nextId;
  li.innerHTML = `<span>New Product ${nextId}</span> <button class="remove-btn">Remove</button>`;
  productList.appendChild(li);
  nextId++;
});

/*
  Q1. Event bubbling: the event starts on the clicked element and then moves up through its
      parents (li -> ul -> body ...), triggering their handlers too.
  Q2. Event delegation: one listener on a parent handles events of many children, using
      event.target to find which child was clicked.
  Q3. Why useful for dynamic elements? Elements added later are covered automatically,
      we do not have to attach a new listener each time. Also uses less memory.
  Q4. stopPropagation(): stops the event from travelling further up to parent elements.
  Q5. event.target is the element that was actually clicked; event.currentTarget is the
      element the listener is attached to.
*/
