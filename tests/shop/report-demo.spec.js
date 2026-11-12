import { test, expect } from "../fixtures";

test.use({ baseURL: process.env.SHOP_URL });

test("REP-01: buscar con evidencia por paso", async ({ catalogPage, page }) => {
  await test.step("Abrir el catalogo", async () => {
    await catalogPage.goto();    
    await test.info().attach("Abrir el catalogo", { body: await page.screenshot(), contentType: "image/png" });
  });

  await test.step("Buscar hammer", async () => {
    await catalogPage.search("hammer");
    await expect(catalogPage.searchCaption).toContainText("hammer");
    await test.info().attach("Buscar producto", { body: await page.screenshot(), contentType: "image/png" });
  });
});