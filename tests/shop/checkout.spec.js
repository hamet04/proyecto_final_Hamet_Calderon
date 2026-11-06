import { test, expect } from "../fixtures.js";
import checkoutData from "../../test-data/checkout-data.json";

test.use({ baseURL: process.env.SHOP_URL });

// El mismo test de siempre, pero con la sesión de la tienda ya iniciada.
const testWithSession = test.extend({
  storageState: async ({ shopStorageState }, use) => {
    await use(shopStorageState);
  },
});

test.describe("Checkout", () => {
  test("CP-CHECKOUT-01: completar el pedido con transferencia bancaria", async ({
    checkoutAtBilling: billingPage,
    paymentPage,
  }) => {
    await billingPage.fillBilling(checkoutData.billing);
    await billingPage.continueToPayment();

    await paymentPage.payWithBankTransfer(checkoutData.bankTransfer);
    await expect(paymentPage.paymentSuccess).toBeVisible();

    await paymentPage.confirmOrder();
    await expect(paymentPage.orderConfirmation).toBeVisible();
  });

  test("CP-CHECKOUT-02: la dirección incompleta no permite pasar al pago", async ({
    checkoutAtBilling: billingPage,
  }) => {
    await expect(billingPage.proceedToPayment).toBeDisabled();

    await billingPage.fillBilling(checkoutData.billing);
    await expect(billingPage.proceedToPayment).toBeEnabled();
  });

  test("CP-CHECKOUT-03: no se verifica el pago sin los datos del banco", async ({
    checkoutAtBilling: billingPage,
    paymentPage,
  }) => {
    await billingPage.fillBilling(checkoutData.billing);
    await billingPage.continueToPayment();

    await paymentPage.chooseBankTransfer();
    await expect(paymentPage.finishButton).toBeDisabled();

    await paymentPage.fillBankTransfer(checkoutData.bankTransfer);
    await expect(paymentPage.finishButton).toBeEnabled();
  });
});

testWithSession.describe("Checkout con la sesión guardada", () => {
  testWithSession(
    "CP-CHECKOUT-04: completar el pedido sin pasar por el formulario de login",
    async ({ checkoutAtBillingWithSession: billingPage, paymentPage }) => {
      await billingPage.fillBilling(checkoutData.billing);
      await billingPage.continueToPayment();

      await paymentPage.payWithBankTransfer(checkoutData.bankTransfer);
      await expect(paymentPage.paymentSuccess).toBeVisible();

      await paymentPage.confirmOrder();
      await expect(paymentPage.orderConfirmation).toBeVisible();
    },
  );
});