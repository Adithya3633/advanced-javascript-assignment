// Part F - Final Integration Challenge (Order summary for Rahul)

"use strict";

// Product class
class Product {
  constructor({ id, name, price, qty }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }

  get total() {
    return this.price * this.qty;
  }
}

// raw data
const customer = { name: "Rahul", city: "Mumbai" };

const productData = [
  { id: 1, name: "Laptop", price: 50000, qty: 1 },
  { id: 2, name: "Mouse", price: 1000, qty: 2 },
  { id: 3, name: "Monitor", price: 15000, qty: 1 },
  { id: 4, name: "Keyboard", price: 2000, qty: 1 },
];

const products = productData.map((item) => new Product(item));

// order config is frozen so nobody can change it by mistake
const orderConfig = Object.freeze({
  currency: "₹",
  highValueLimit: 5000,
  confirmationDelay: 1500,
});

const { currency, highValueLimit, confirmationDelay } = orderConfig;
const { name: customerName } = customer;

// filter -> products above 5000 (used to decide priority handling)
const highValueProducts = products.filter((product) => product.price > highValueLimit);

// map -> product totals
const productTotals = products.map((product) => ({ name: product.name, total: product.total }));

// reduce -> order total
const orderTotal = productTotals.reduce((sum, item) => sum + item.total, 0);

// Set -> unique product ids
const uniqueProductIds = new Set(products.map((product) => product.id));

// Map -> inventory (id -> product)
const inventory = new Map(products.map((product) => [product.id, product]));

// order object, converted to JSON (e.g. to send to an API)
const order = {
  customer: customerName,
  items: productTotals,
  total: orderTotal,
  priority: highValueProducts.length > 0 ? "high" : "normal",
};
const orderJson = JSON.stringify(order);

// async order confirmation
function confirmOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inventory.size === 0) reject(new Error("No products in inventory"));
      else resolve("Confirmed Successfully!");
    }, confirmationDelay);
  });
}

async function showOrderSummary() {
  console.log("====== QUICKCART ORDER SUMMARY ======");
  console.log(`Customer: ${customerName}`);
  console.log("Products:");
  productTotals.forEach(({ name, total }) => {
    console.log(`${name.padEnd(10)}- ${currency}${total}`);
  });
  console.log(`Total Order Amount: ${currency}${orderTotal}`);
  console.log(`Unique Products: ${uniqueProductIds.size}`);
  console.log("Order Status: Processing...");

  try {
    const status = await confirmOrder();
    console.log(`Order Status: ${status}`);
  } catch (error) {
    console.log(`Order Status: Failed - ${error.message}`);
  }
  console.log("=====================================");

  // order JSON is built above; uncomment to view it
  // console.log(orderJson);
}

showOrderSummary();
