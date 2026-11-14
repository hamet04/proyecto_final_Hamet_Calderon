// expect viene de Playwright: se usa en goto() para esperar a que el catálogo cargue.
import { expect } from "@playwright/test";

// Un Page Object agrupa los selectores y las acciones de una pantalla (el catálogo).
export class CatalogPage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.sortSelect = page.locator('[data-test="sort"]');
    this.searchCaption = page.locator('[data-test="search-caption"]');
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
    // Se eliminó this.element: tenía un producto fijo y nadie lo usaba.
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.productNames.first()).toBeVisible();
  }

  async prices() {
    const texts = await this.productPrices.allTextContents(); // los textos, por ejemplo "$14.15"
    // /[^0-9.]/g = todo lo que NO sea dígito o punto. "$1,000.00" -> "1000.00"; Number() lo vuelve número.
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, "")));
  }

  async names() {
    return this.productNames.allTextContents();
  }
  async openProduct(name) {
    //    await this.page.getByRole('link', { name }).click();
    // filter({ hasText: regex }) se queda con los nombres cuyo texto coincide con la expresión.
    // ^ = inicio, $ = fin, \s* = espacios opcionales: el nombre debe ser exacto, no parcial.
    const exactName = this.productNames.filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) });
    // getByRole("link").filter({ has: ... }) = el enlace que contiene ese nombre exacto.
    await this.page.getByRole("link").filter({ has: exactName }).click();
  }

  // Busca y espera la respuesta de la API que trae los resultados (S18).
  async search(term) {
    await this.searchBox.fill(term);
    const response = this.page.waitForResponse(
      (res) => res.url().includes("/products/search") && res.status() === 200,
    );
    await this.searchButton.click();
    await response;
  }
}