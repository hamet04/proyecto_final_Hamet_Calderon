export class HomePage {
  constructor(page) {
    this.page = page; //guardo las propiedades de mi página
  }
  //método para abrir pagina de login
  async goto() {
    await this.page.goto('/');
  }
  //método para abrir página de producto
  async openProduct(name) {
    await this.page.getByRole('link', { name }).click();
  }
}