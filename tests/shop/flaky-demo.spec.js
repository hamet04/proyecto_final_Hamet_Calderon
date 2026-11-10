import { test, expect } from "../fixtures";

test.use({ baseURL: process.env.SHOP_URL });

// Demo de prueba inestable: espera fija. Se ejecuta aparte.
test("FLAKY-DEMO: buscar con espera fija", async ({ catalogPage }) => {
  await catalogPage.goto();
  await catalogPage.searchBox.fill("hammer");
  await catalogPage.searchButton.click();
  await catalogPage.page.waitForTimeout(550);

  const names = await catalogPage.names();
  expect(names.length).toBeLessThan(9);
});