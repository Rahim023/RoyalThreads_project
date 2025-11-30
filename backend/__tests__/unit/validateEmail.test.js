const { validateEmail } = require("../../utils/validate.js");

test("valid email", () => {
  expect(validateEmail("test@gmail.com")).toBe(true);
});

test("invalid email", () => {
  expect(validateEmail("wrongemail")).toBe(false);
});
