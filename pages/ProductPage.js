export class ProductPage {
  constructor(page) {
    this.page = page; //guardo las propiedades de mi página
    //guardando los localizadores
    this.title = page.getByRole('heading', { level: 1 });
    this.addCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.confirmation = page.getByRole('alert');
    this.cartLink = page.locator('[data-test="nav-cart"]');
  }
  //método para agregar producto al carrito
  async addToCart() {
    await this.addCartButton.click();
  }
  //método para abrir el carrito
  async opencart() {
    await this.cartLink.click();
  }
}