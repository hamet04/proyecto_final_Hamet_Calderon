import { expect } from "@playwright/test";

export class BillingPage {
  constructor(page) {
    this.page = page;
    this.country = page.locator('[data-test="country"]');
    this.postalCode = page.locator('[data-test="postal_code"]');
    this.houseNumber = page.locator('[data-test="house_number"]');
    this.street = page.locator('[data-test="street"]');
    this.city = page.locator('[data-test="city"]');
    this.state = page.locator('[data-test="state"]');
    this.proceedToPayment = page.locator('[data-test="proceed-3"]');
  }

  // La tienda carga la dirección guardada con retraso y vuelve a rellenar
  // el formulario. Si escribimos antes, se borra lo escrito.
  async waitForSavedAddress() {
    await expect(this.street).toHaveValue(/.+/);
    await expect(this.city).toHaveValue(/.+/);
  }

  async fillBilling({ country, postalCode, houseNumber }) {
    await this.country.selectOption({ label: country });
    await this.postalCode.fill(postalCode);
    await this.houseNumber.fill(houseNumber);
  }

  async continueToPayment() {
    await this.proceedToPayment.click();
  }
}