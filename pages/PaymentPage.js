export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.paymentMethod = page.locator('[data-test="payment-method"]');
    this.bankName = page.locator('[data-test="bank_name"]');
    this.accountName = page.locator('[data-test="account_name"]');
    this.accountNumber = page.locator('[data-test="account_number"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.paymentSuccess = page.getByText(/payment was successful/i);
    this.orderConfirmation = page.getByText(/Your invoice number is INV-\d+/);
  }

  async chooseBankTransfer() {
    await this.paymentMethod.selectOption({ label: "Bank Transfer" });
  }

  async fillBankTransfer({ bankName, accountName, accountNumber }) {
    await this.bankName.fill(bankName);
    await this.accountName.fill(accountName);
    await this.accountNumber.fill(accountNumber);
  }

  // Elige transferencia, llena los datos y pulsa "Check payment".
  async payWithBankTransfer(bankTransfer) {
    await this.chooseBankTransfer();
    await this.fillBankTransfer(bankTransfer);
    await this.checkPayment();
  }

  // El mismo botón (data-test="finish") dice "Check payment" y luego "Confirm".
  async checkPayment() {
    await this.finishButton.click();
  }

  async confirmOrder() {
    await this.finishButton.click();
  }
}