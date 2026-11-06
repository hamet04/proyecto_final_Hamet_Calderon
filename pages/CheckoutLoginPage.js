export class CheckoutLoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    // Pantalla "Hello …, you are already logged in"
    this.proceedAfterLogin = page.locator('[data-test="proceed-2"]');
  }

  async login(user, password) {
    await this.email.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async continueAfterLogin() {
    await this.proceedAfterLogin.click();
  }
}