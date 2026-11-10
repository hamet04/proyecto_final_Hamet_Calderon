import { test, expect } from "../fixtures";

test.use({ baseURL: process.env.SHOP_URL });

test.describe("Esperas condicionales en el catalogo", () => {
  test("CP-ESPERA-01: buscar 'hammer' espera la respuesta de la API", async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.search("hammer");

    await expect(catalogPage.searchCaption).toContainText("hammer");
    const names = await catalogPage.names();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain("hammer");
    }
  });

  test("CP-ESPERA-02: ordenar por precio ascendente (expect.poll)", async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.sortSelect.selectOption("price,asc");

    await expect
      .poll(async () => {
        const prices = await catalogPage.prices();
        const sorted = [...prices].sort((a, b) => a - b);
        return prices.length > 1 && prices.join() === sorted.join();
      })
      .toBe(true);
  });

  test("CP-ESPERA-03: ordenar por precio descendente (toPass)", async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.sortSelect.selectOption("price,desc");

    await expect(async () => {
      const prices = await catalogPage.prices();
      expect(prices.length).toBeGreaterThan(1);
      expect(prices[0]).toBeGreaterThanOrEqual(prices[prices.length - 1]);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    }).toPass();
  });

  test("CP-ESPERA-04: abrir un producto espera la URL (waitForURL)", async ({ catalogPage, page }) => {
    await catalogPage.goto();
    await catalogPage.productNames.first().click();

    await page.waitForURL(/\/product\//);
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

  test("CP-ESPERA-05: agregar al carrito espera la insignia y el aviso", async ({ catalogPage, page }) => {
    await catalogPage.goto();
    await catalogPage.productNames.first().click();
    await page.waitForURL(/\/product\//);

    await page.locator('[data-test="add-to-cart"]').click();

    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("1");
    await expect(page.getByRole("alert")).toContainText("Product added to shopping cart");
  });
});