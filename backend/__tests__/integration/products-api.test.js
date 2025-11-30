const axios = require("axios");

test("fetches product list", async () => {
  const res = await axios.get("http://localhost:5000/api/products");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.data)).toBe(true);
});
