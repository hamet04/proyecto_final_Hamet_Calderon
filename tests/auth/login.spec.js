import { test, expect } from "../fixtures";

test.describe("Autenticación", () => {
   test("inicio de sesion", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, credentials.password);
    await expect(loginPage.page).toHaveURL("/logged-in-successfully/");
    await expect(loginPage.successMessage).toBeVisible();
    await expect(loginPage.page.getByRole("link", { name: "Log out" })).toBeVisible();
  });

  test("usuario inválido", async ({ loginPage, credentials }) => {
    await loginPage.login("incorrectUser", credentials.password);
    await expect(loginPage.errorMessage).toHaveText( "Your username is invalid!");
    await expect(loginPage.page).toHaveURL(/practice-test-login/);
  });

  test("contraseña inválida", async ({ loginPage, credentials }) => {
    await loginPage.login(credentials.username, "incorrectPassword");
    await expect(loginPage.errorMessage).toHaveText( "Your password is invalid!");
    await expect(loginPage.errorMessage).not.toContainText("username");
  });
});