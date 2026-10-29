import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Autenticación", () => {
  let loginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });
  test("inicio de sesion", async () => {
    await loginPage.login(process.env.LOGIN_USER, process.env.LOGIN_PASSWORD);
    await expect(loginPage.page).toHaveURL("/logged-in-successfully/");
    await expect(loginPage.page.getByText("Congratulations student. You successfully logged in!")).toBeVisible();
    await expect(loginPage.page.getByRole("link", { name: "Log out" })).toBeVisible();
  });

  test("usuario inválido", async () => {
    await loginPage.login("incorrectUser", process.env.LOGIN_PASSWORD);
    await expect(loginPage.errorMessage).toHaveText( "Your username is invalid!");
    await expect(loginPage.page).toHaveURL(/practice-test-login/);
  });

  test("contraseña inválida", async () => {
    await loginPage.login(process.env.LOGIN_USER, "incorrectPassword");
    await expect(loginPage.errorMessage).toHaveText( "Your password is invalid!");
    await expect(loginPage.errorMessage).not.toContainText("username");
  });
});