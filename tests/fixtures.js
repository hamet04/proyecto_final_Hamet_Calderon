import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";
import { CheckoutCartPage } from "../pages/CheckoutCartPage.js";
import { CheckoutLoginPage } from "../pages/CheckoutLoginPage.js";
import { BillingPage } from "../pages/BillingPage.js";
import { PaymentPage } from "../pages/PaymentPage.js";
import checkoutData from "../test-data/checkout-data.json";
import { CatalogPage } from "../pages/CatalogPage";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable ${name} en tu archivo .env`);
  }
  return value;
}

// Agrega cada producto de la lista al carrito y empieza el checkout.
// Recibe las fixtures que necesita y la lista de nombres de producto.
async function startCheckoutWithProducts({ homePage, productPage, checkoutCartPage }, products) {
  // entries() da [posición, nombre] para cada producto de la lista.
  for (const [index, name] of products.entries()) {
    // La fixture homePage ya abrió el catálogo; para los siguientes productos hay que volver a él.
    if (index > 0) await homePage.goto();
    await homePage.openProduct(name);
    await productPage.addToCart();
    await expect(productPage.confirmation).toBeVisible(); // el aviso confirma que se agregó
  }
  await productPage.openCart();
  await checkoutCartPage.startCheckout();
}

async function startCheckoutWithProduct(fixtures) {
  await startCheckoutWithProducts(fixtures, [checkoutData.product]);
}

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  credentials: async ({}, use) => {
    await use({
      username: requireEnv("LOGIN_USER"),
      password: requireEnv("LOGIN_PASSWORD")
    });
  },
  loggedInPage: async ({ page, loginPage, credentials }, use) => {
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/logged-in-successfully/);
    await use(page);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  shopCredentials: async ({}, use) => {
    await use({
      user: requireEnv("SHOP_USER"),
      password: requireEnv("SHOP_PASSWORD"),
    });
  },

  checkoutCartPage: async ({ page }, use) => {
    await use(new CheckoutCartPage(page));
  },

  checkoutLoginPage: async ({ page }, use) => {
    await use(new CheckoutLoginPage(page));
  },

  billingPage: async ({ page }, use) => {
    await use(new BillingPage(page));
  },

  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  // Llega a la pantalla de dirección iniciando sesión por el formulario.
  checkoutAtBilling: async (
    { homePage, productPage, checkoutCartPage, checkoutLoginPage, billingPage, shopCredentials },
    use,
  ) => {
    await startCheckoutWithProduct({ homePage, productPage, checkoutCartPage });
    await checkoutLoginPage.login(shopCredentials.user, shopCredentials.password);
    await checkoutLoginPage.continueAfterLogin();
    await billingPage.waitForSavedAddress();
    await use(billingPage);
  },

  // Igual que checkoutAtBilling, pero con todos los productos de checkout-data.json (products).
  checkoutAtBillingWithProducts: async (
    { homePage, productPage, checkoutCartPage, checkoutLoginPage, billingPage, shopCredentials },
    use,
  ) => {
    await startCheckoutWithProducts({ homePage, productPage, checkoutCartPage }, checkoutData.products);
    await checkoutLoginPage.login(shopCredentials.user, shopCredentials.password);
    await checkoutLoginPage.continueAfterLogin();
    await billingPage.waitForSavedAddress();
    await use(billingPage);
  },

  // Igual, pero sin formulario: exige que el contexto ya traiga la sesión.
  checkoutAtBillingWithSession: async (
    { homePage, productPage, checkoutCartPage, checkoutLoginPage, billingPage },
    use,
  ) => {
    await startCheckoutWithProduct({ homePage, productPage, checkoutCartPage });
    await checkoutLoginPage.continueAfterLogin();
    await billingPage.waitForSavedAddress();
    await use(billingPage);
  },

  // Sesión de la tienda: se inicia sesión UNA vez por worker y se guarda.
  // La tienda guarda el token en localStorage, y storageState lo captura.
  shopStorageState: [
    async ({ browser }, use) => {
      const context = await browser.newContext({ baseURL: process.env.SHOP_URL });
      const page = await context.newPage();
      await page.goto("/auth/login");
      await page.locator('[data-test="email"]').fill(requireEnv("SHOP_USER"));
      await page.locator('[data-test="password"]').fill(requireEnv("SHOP_PASSWORD"));
      await page.locator('[data-test="login-submit"]').click();
      await expect(page).toHaveURL(/\/account/);
      const state = await context.storageState();
      await context.close();
      await use(state);
    },
    { scope: "worker" },
  ],
});

export { expect };