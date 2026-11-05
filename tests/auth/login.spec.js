import { test, expect } from "../fixtures";
import dataLogin from "../../test-data/data-login.json";

test.describe("Autenticación", () => {
  test("CP-AUTH-01: inicio de sesion", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, credentials.password);
    await expect(loginPage.page).toHaveURL("/logged-in-successfully/");
    await expect(loginPage.successMessage).toBeVisible();
    await expect( loginPage.page.getByRole("link", { name: "Log out" })).toBeVisible();
  });

  for (const { id, name, username, password, error } of dataLogin) {
    test(`${id}: ${name}`, async ({ loginPage, credentials }) => {
      await loginPage.login(username ?? credentials.username, password);
      await expect(loginPage.errorMessage).toHaveText(error);
      await expect(loginPage.page).toHaveURL(/practice-test-login/);
    });
  }  

  test("CP-AUTH-04: cerrar sesión", async ({ loggedInPage, loginPage }) => {
    await loggedInPage.getByRole("link", { name: "Log out" }).click();
    await expect(loginPage.page).toHaveURL(/practice-test-login/);
    await expect(loginPage.submitButton).toBeVisible();
  });
});