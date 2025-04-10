import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(readonly driver: WebDriver) {
    super(driver);
  }

  async authenticate(username: string, password: string) {
    await this.type(By.id('user-name'), username);
    await this.type(By.id('password'), password);
    await this.click(By.id('login-button'));
  }

  async failureMessagePresent() {
    return await this.text(By.css('[data-test="error"]'));
  }
}
