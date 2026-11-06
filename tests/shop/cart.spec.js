import { test, expect } from "../fixtures.js";

test.use({ baseURL: process.env.SHOP_URL });

const products = ["Bolt Cutters", "Thor Hammer"];

test.describe("Tienda", () => {
  for (const name of products) {
    test(`CP-TIENDA-01: agregar ${name} al carrito`, async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.openProduct(name);
      await expect(productPage.title).toHaveText(name);
      await productPage.addToCart();
      await expect(productPage.confirmation).toBeVisible();
      await productPage.openCart();
      await expect(cartPage.rowFor(name)).toBeVisible();
      await expect(cartPage.quantityOf(name)).toHaveValue("1");
    });
  }

  test("CP-TIENDA-02: agregar dos productos distintos al carrito", async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const [productA, productB] = products;

    await homePage.openProduct(productA);
    await productPage.addToCart();
    await expect(productPage.confirmation).toBeVisible();

    await homePage.goto();
    await homePage.openProduct(productB);
    await productPage.addToCart();
    await expect(productPage.confirmation).toBeVisible();

    await productPage.openCart();
    await expect(cartPage.rowFor(productA)).toBeVisible();
    await expect(cartPage.rowFor(productB)).toBeVisible();
    await expect(cartPage.quantityOf(productA)).toHaveValue("1");
    await expect(cartPage.quantityOf(productB)).toHaveValue("1");
  });
});