const axios = require("axios");

test("products API loads in under 3s", async () => {
  const start = Date.now();
  const res = await axios.get("http://localhost:5000/api/products");
  const time = Date.now() - start;

  expect(res.status).toBe(200);
  expect(time).toBeLessThan(3000);
});
