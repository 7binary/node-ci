const puppeteer = require('puppeteer');

class CustomPage {
  static async build(baseUrl) {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page, baseUrl);

    return new Proxy(customPage, {
      get: function(target, prop) {
        return target[prop] || browser[prop] || page[prop];
      },
    });
  }

  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async login() {
    const user = await global.getUser();
    const { session, sig } = global.getSession(user);

    await this.page.setCookie({ name: 'express:sess', value: session });
    await this.page.setCookie({ name: 'express:sess.sig', value: sig });
    await this.page.goto(this.baseUrl);
    await this.page.waitForSelector('a[href="/auth/logout"]');
  }

  async el(selector) {
    return await this.page.$eval(selector, el => el.innerHTML);
  }

  async open(url = '') {
    return await this.page.goto(`${this.baseUrl}${url}`);
  }

  get(path) {
    return this.page.evaluate((_path) =>
      fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json()), path,
    );
  }

  post(path, data = {}) {
    return this.page.evaluate((_path, _data) =>
      fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_data),
      }).then(res => res.json()), path, data,
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      }),
    );
  }
}

module.exports = CustomPage;
