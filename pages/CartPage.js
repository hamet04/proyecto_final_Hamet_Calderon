export class CartPage {
  constructor(page) {
    this.page = page; //guardo las propiedades de mi página
        
  }
  
  //método para iniciar sesión
  rowFor(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  quantityOf(name) {
    return this.rowFor(name).getByRole('spinbutton');
  }

}