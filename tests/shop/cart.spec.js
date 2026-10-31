import { test, expect } from "../fixtures";

test.use({ baseURL: process.env.SHOP_URL });
const productName = "Thor Hammer";

test.describe("Tienda Virtual", () => {
  test("Agregar un producto al carrito", async ({
    homePage,
    cartPage,
    productPage,
  }) => {
    await homePage.openProduct(productName);
    await expect(productPage.title).toHaveText(productName);
    await productPage.addToCart();
    await expect(productPage.confirmation).toBeVisible();
    await productPage.opencart();
    await expect(cartPage.rowFor(productName)).toBeVisible();
    await expect(cartPage.quantityOf(productName)).toHaveValue("1");
  });
});
