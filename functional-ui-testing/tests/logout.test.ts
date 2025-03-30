import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Pages } from '../pages';
import { Browser } from '../lib/browser';
import { config } from '../config';

describe('Logout Functionality', function () {
  let page: Pages;

  beforeEach(async function () {
    const browser = await new Browser('firefox').build();
    page = new Pages(browser);
    await page.login.visit('/');
  });

  afterEach(async function () {
    await page.quit();
  });

  it('redirects to the login page on successful logged out', async function () {
    await page.login.authenticate(config.username, config.password);
    await page.login.driver.sleep(2000);
    const url = await page.home.unauthenticate();
    expect(url).equal(`${config.baseUrl}/`);
  });
});