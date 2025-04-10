import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Pages } from '../pages';
import { Browser } from '../lib/browser';
import { config } from '../config';
import { By, logging } from 'selenium-webdriver';

describe('Home Page Functionality', function () {
  let page: Pages;
  const logger: logging.Logger = logging.getLogger();

  beforeEach(async function () {
    const browser = await new Browser('firefox').build();
    page = new Pages(browser);
    await page.login.visit('/');
  });

  afterEach(async function () {
    await page.quit();
  });

  it('redirects to the home page page on successful logged in', async function () {
    await page.login.authenticate(config.username, config.password);
    await page.login.driver.sleep(2000);
    const url = await page.home.url();
    expect(url).equal(`${config.baseUrl}/inventory.html`);
  });

  it('adding the item to the cart', async function () {
    await page.login.authenticate(config.username, config.password);
    await page.login.driver.sleep(2000);

    const ourItem = await page.home.text(By.css('.inventory_item_name'));
    logger.debug(`Our item: ${ourItem}`);
    expect(ourItem).to.contain(
      'Sauce Labs',
      "Item name does not contain 'Sauce Labs'",
    );

    await page.home.click(By.css('.btn_inventory'));
    await page.home.driver.sleep(2000);

    const results = await page.home.text(
      By.css('[data-test="shopping-cart-badge"]'),
    );
    logger.debug(`Results: ${results}`);
    expect(results).to.contain('1');
    await page.home.driver.sleep(5000);
  });
});
