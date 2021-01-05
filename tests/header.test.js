const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build('http://localhost:3000');
  await page.open();
});

afterEach(async () => {
  page.close();
});

test('The header has a correct text', async () => {
  const text = await page.el('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('Clicking login starts OAUTH flow', async () => {
  await page.click('.right a');
  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in shows logout button', async () => {
  await page.login();
  const text = await page.el('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
});
