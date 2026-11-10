import { expect } from "@playwright/test";

export class CatalogPage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.sortSelect = page.locator('[data-test="sort"]');
    this.searchCaption = page.locator('[data-test="search-caption"]');
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.productNames.first()).toBeVisible();
  }

  async prices() {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => Number(text.replace("$", "")));
  }

  async names() {
    return this.productNames.allTextContents();
  }

  // Search and wait for the API answer that carries the results.
  async search(term) {
    await this.searchBox.fill(term);
    const response = this.page.waitForResponse(
      (res) => res.url().includes("/products/search") && res.status() === 200,
    );
    await this.searchButton.click();
    await response;
  }
}