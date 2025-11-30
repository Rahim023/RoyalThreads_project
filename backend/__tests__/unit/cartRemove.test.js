// __tests__/unit/cartRemove.test.js
const { removeItem } = require("../../utils/cart.js");

test("removes an item from cart correctly", () => {
  const cart = [
    { id: 1, name: "Shirt", price: 20 },
    { id: 2, name: "Pants", price: 30 },
  ];

  const updatedCart = removeItem(cart, 1);

  expect(updatedCart.length).toBe(1);
  expect(updatedCart[0].id).toBe(2);
});
