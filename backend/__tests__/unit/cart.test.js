const { calculateTotal } = require("../../utils/cart.js");

test("calculates total correctly", () => {
  const cart = [
    { price: 100, qty: 2 },
    { price: 50, qty: 1 }
  ];
  expect(calculateTotal(cart)).toBe(250);
});
