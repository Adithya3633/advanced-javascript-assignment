// Part A - Objects, Prototypes & ES6 Classes

"use strict";

// ---------------------------------------------------------------
// Task 1 - Prototype based products
// ---------------------------------------------------------------
function taskOnePrototype() {
  console.log("----- Task 1: Prototype based products -----");

  function Product(productName, price, category) {
    this.productName = productName;
    this.price = price;
    this.category = category;
  }

  // method is on the prototype so only ONE copy exists in memory
  Product.prototype.displayProduct = function () {
    return `${this.productName} | Price: ₹${this.price} | Category: ${this.category}`;
  };

  const laptop = new Product("Laptop", 50000, "Electronics");
  const mouse = new Product("Mouse", 800, "Accessories");
  const shirt = new Product("T-Shirt", 999, "Clothing");

  [laptop, mouse, shirt].forEach((item) => console.log(item.displayProduct()));

  // proof that all objects share the same function
  console.log("Same method shared?", laptop.displayProduct === mouse.displayProduct); // true
  console.log("laptop.__proto__ === Product.prototype ->", laptop.__proto__ === Product.prototype); // true

  /*
    Q1. Why add displayProduct() to the prototype instead of the constructor?
    If we write it inside the constructor, every new object gets its own copy of the
    function, which wastes memory. On the prototype there is a single copy that all
    objects share through the prototype chain.

    Q2. __proto__ vs prototype
    - prototype: a property that exists on constructor FUNCTIONS. It is the object that
      will become the parent of the objects created with "new".
    - __proto__: a property on every OBJECT (instance) which points to the prototype
      it was created from. So laptop.__proto__ === Product.prototype.

    Q3. If JavaScript cannot find a property on an object?
    It goes up the prototype chain (object -> its prototype -> Object.prototype).
    If it is still not found at the end (null) the result is undefined
    (calling it like a function gives a TypeError).
  */
}

// ---------------------------------------------------------------
// Task 2 - ES6 classes with inheritance
// ---------------------------------------------------------------
function taskTwoClasses() {
  console.log("\n----- Task 2: ES6 classes -----");

  class Product {
    constructor(productName, price, category) {
      this.productName = productName;
      this.price = price;
      this.category = category;
    }

    getProductDetails() {
      return `${this.productName} (${this.category}) - ₹${this.price}`;
    }
  }

  class ElectronicProduct extends Product {
    constructor(productName, price, warrantyYears) {
      super(productName, price, "Electronics"); // parent constructor first
      this.warrantyYears = warrantyYears;
    }

    // unique method of ElectronicProduct
    getWarrantyInfo() {
      return `${this.productName} comes with ${this.warrantyYears} year(s) warranty`;
    }
  }

  class ClothingProduct extends Product {
    constructor(productName, price, size) {
      super(productName, price, "Clothing");
      this.size = size;
    }

    // unique method of ClothingProduct
    getSizeInfo() {
      return `${this.productName} is available in size ${this.size}`;
    }
  }

  const phone = new ElectronicProduct("Smartphone", 25000, 2);
  const jeans = new ClothingProduct("Jeans", 1800, "M");

  console.log(phone.getProductDetails());
  console.log(phone.getWarrantyInfo());
  console.log(jeans.getProductDetails());
  console.log(jeans.getSizeInfo());
  console.log("phone instanceof Product ->", phone instanceof Product); // true

  /*
    Q1. Purpose of extends
    It makes a child class inherit the properties and methods of a parent class, so we
    reuse code and only add what is different in the child.

    Q2. Why super() before this?
    In a derived class the "this" object is created by the parent constructor. Until
    super() runs, "this" is not initialised and using it throws a ReferenceError.

    Q3. Are ES6 classes completely different from prototype inheritance?
    No. Classes are just cleaner syntax (syntactic sugar) over the same prototype
    mechanism. typeof Product is still "function" and methods still live on
    Product.prototype.
  */
}

// ---------------------------------------------------------------
// Task 3 - ES6 syntax used in checkout
// ---------------------------------------------------------------
function taskThreeSyntax() {
  console.log("\n----- Task 3: ES6 syntax in checkout -----");

  // (A) arrow function for the final price after discount
  const getFinalPrice = (price, discountPercent) => price - (price * discountPercent) / 100;
  console.log("Final price:", getFinalPrice(50000, 10)); // 45000

  // (B) template literal
  const customerName = "Rahul";
  const productName = "Laptop";
  const total = 50000;
  console.log(`Hello ${customerName}, your order of ${productName} is confirmed. Total: ₹${total}`);

  // (C) destructuring
  const customer = { name: "Rahul", email: "rahul@gmail.com", city: "Mumbai" };
  const { name, email } = customer;
  console.log("Name:", name, "| Email:", email);

  // (D) rest operator
  const calculateTotal = (...prices) => prices.reduce((sum, p) => sum + p, 0);
  console.log("Total of prices:", calculateTotal(50000, 800, 1500)); // 52300

  // (E) spread - copy product with new price, original stays same
  const product = { name: "Laptop", price: 50000, category: "Electronics" };
  const updatedProduct = { ...product, price: 45000 };
  console.log("Original:", product);
  console.log("Copy with new price:", updatedProduct);
}

taskOnePrototype();
taskTwoClasses();
taskThreeSyntax();
