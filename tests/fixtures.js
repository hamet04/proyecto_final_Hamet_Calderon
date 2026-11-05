import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";


export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  credentials: async ({}, use) => {
    for (const name of ["LOGIN_USER", "LOGIN_PASSWORD"]) {
      if (!process.env[name]) {
        throw new Error(`La variable de entorno: ${name} esta vacía`);
      }
    }
    await use({
      username: process.env.LOGIN_USER,
      password: process.env.LOGIN_PASSWORD
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
  }
});

export { expect };
