describe('Ids Month View e2e Tests', () => {
  const url = 'http://localhost:4444/ids-month-view';
  const name = 'ids-month-view';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Month View Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });

  it('should support changing locale', async () => {
    await page.evaluate(() => {
      const container = document.querySelector('ids-container');
      const component = document.querySelector('ids-month-view');

      component.month = 11;
      component.year = 2021;
      component.day = 22;
      component.firstDayOfWeek = 0;

      container.setLocale('ar-SA');
      container.setLanguage('ar');
    });

    // Wait till calendars load
    await page.waitForFunction(() =>
      document.querySelector('ids-month-view')?.locale?.calendar().name === 'islamic-umalqura');

    // Selected day
    const day = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    const month = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    const year = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    const localeDay = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(22);
    expect(+month).toEqual(11);
    expect(+year).toEqual(2021);
    expect(+localeDay).toEqual(18);

    // Number of days in given month
    let numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(30);

    // Prev month
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-previous')?.click());

    numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(29);

    // Back to initial month and next month
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-next')?.click());
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-next')?.click());

    numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(29);
  });
});
