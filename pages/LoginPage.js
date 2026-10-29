export class LoginPage {
  constructor(page) {
    this.page = page; //guardo las propiedades de mi página
    //guardando los localizadores
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.locator('#error');
  }
  //método para abrir pagina de login
  async goto() {
    await this.page.goto('/practice-test-login/');
  }
  //método para iniciar sesión
  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}