import { afterEach, beforeEach, describe, it } from 'mocha';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';
import { Pages } from '../pages';
import { Browser } from '../lib/browser';
import { config } from '../config';

describe('Login Functionality', function () {
  let page: Pages;

  beforeEach(async function () {
    const browser = await new Browser('firefox').build();
    page = new Pages(browser);
    await page.login.visit('/');
  });

  afterEach(async function () {
    await page.quit();
  });

  it('shows login document title', async function () {
    const title = await page.login.title();
    expect(title).equal('Swag Labs');
  });

  it('shows the products page when user submits valid credentials', async function () {
    await page.login.authenticate(config.username, config.password);
    await page.login.driver.sleep(2000);
    const productPageTitle = await page.login.text(By.css('[data-test="title"]'));
    const isInventoryContainerVisible = await page.login.isVisible(By.css('[data-test="inventory-container"]'));
    const url = await page.login.url();
    expect(productPageTitle).equal('Products');
    expect(url).equal(`${config.baseUrl}/inventory.html`);
    expect(isInventoryContainerVisible).to.be.true;
  });

  it('shows error response message when user submits invalid credentials', async function () {
    await page.login.authenticate(config.username, '!nv4lidP455w0rD');
    const message = await page.login.failureMessagePresent();
    expect(message).contain('Username and password do not match any user in this service');
  });
});