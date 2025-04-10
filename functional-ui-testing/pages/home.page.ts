import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(readonly driver: WebDriver) {
    super(driver);
  }

  async unauthenticate() {
    await this.click(By.id('react-burger-menu-btn'));
    await this.driver.sleep(500);
    const controlSidebarVisible = await this.isVisible(
      By.className('bm-menu-wrap'),
    );

    if (controlSidebarVisible) {
      await this.click(By.css('[data-test="logout-sidebar-link"]'));
      return await this.url();
    }

    return await this.url();
  }
}
