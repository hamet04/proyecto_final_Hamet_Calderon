export class CheckoutCartPage {
  constructor(page) {
    this.page = page;
    this.proceedFromCart = page.getByRole("button", { name: /proceed to checkout/i });
  }

  async startCheckout() {
    await this.proceedFromCart.click();
  }
}