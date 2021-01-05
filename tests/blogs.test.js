const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build('http://localhost:3000');
  await page.open();
});

afterEach(async () => {
  page.close();
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.open('/blogs');
    await page.waitForSelector('a.btn-floating');
    await page.click('a.btn-floating');
    await page.waitForSelector('form label');
  });

  test('When logged in, can see blog create form', async () => {
    const label = await page.el('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', () => {
    const title = new mongoose.Types.ObjectId().toString();
    beforeEach(async () => {
      await page.type('input[name="title"]', title);
      await page.type('input[name="content"]', 'Life matters');
      await page.click('button[type="submit"]');
    });
    test('Submitting takes user to review screen', async () => {
      const text = await page.el('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submitting then adds blog to saved blogs', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card-stacked');
      await page.el(`[data-title="${title}"]`);
    });
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('button[type="submit"]');
    });
    test('The form shows an error message', async () => {
      const titleError = await page.el('.title .red-text');
      const contentError = await page.el('.content .red-text');
      expect(titleError).toBeTruthy();
      expect(contentError).toBeTruthy();
    });
  });
});

describe('When not logged in', () => {
  const actions = [
    { method: 'get', path: '/api/blogs' },
    { method: 'post', path: '/api/blogs', data: { title: 'T', content: 'C' } },
  ];
  test('Actions are prohibited', async () => {
    (await page.execRequests(actions)).forEach(res => expect(res.error).toBeTruthy());
  });
});
