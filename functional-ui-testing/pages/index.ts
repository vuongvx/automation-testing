import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from './login.page';
import { HomePage } from './home.page';

export class Pages {
  public login: LoginPage;
  public home: HomePage;

  constructor(public browser: WebDriver) {
    this.login = new LoginPage(browser);
    this.home = new HomePage(browser);
  }

  async dispose() {
    await this.cleanup();
    await this.close();
  }

  async quit() {
    if (this.browser != null) {
      await this.browser.quit();
    }
  }

  async cleanup() {
    await this.browser.manage().deleteAllCookies();
  }

  async close() {
    await this.browser.close();
  }
}
