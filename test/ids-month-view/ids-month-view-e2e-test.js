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

  it('should display correct number of days in a month', async () => {
    // Initial month
    let day = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    let month = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    let year = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    let dayText = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').textContent);
    let numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(+day).toEqual(15);
    expect(+month).toEqual(10);
    expect(+year).toEqual(2021);
    expect(+dayText).toEqual(15);
    expect(numberOfDays).toEqual(30);

    // Changing date
    await page.evaluate((el) => {
      const component = document.querySelector(el);

      component.month = 1;
      component.year = 2000;
      component.day = 1;
    }, name);

    day = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    month = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    year = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    dayText = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').textContent);
    numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(+day).toEqual(1);
    expect(+month).toEqual(1);
    expect(+year).toEqual(2000);
    expect(+dayText).toEqual(1);
    expect(numberOfDays).toEqual(29);

    // Move to current month
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-today')?.click());

    day = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    month = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    year = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    dayText = await page.$eval(name, (el) => el.shadowRoot.querySelector('td.is-selected').textContent);
    numberOfDays = await page.$eval(name, (el) =>
      el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    const now = new Date();

    expect(+day).toEqual(now.getDate());
    expect(+month).toEqual(now.getMonth());
    expect(+year).toEqual(now.getFullYear());
    expect(+dayText).toEqual(now.getDate());
    expect(numberOfDays).toEqual(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  });

  it('should be selectable', async () => {
    await page.evaluate((el) => {
      const component = document.querySelector(el);

      component.month = 11;
      component.year = 2021;
      component.day = 20;
    }, name);

    // Click on prev month day
    await page.$eval(name, (el) => el.shadowRoot.querySelector('td.alternate')?.click());

    // Should change to prev month
    let month = await page.$eval(name, (el) => el.month);
    let year = await page.$eval(name, (el) => el.year);

    expect(month).toEqual(10);
    expect(year).toEqual(2021);

    // Back to initial month and click to next month day
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-next')?.click());
    await page.$eval(name, (el) => el.shadowRoot.querySelector('td.alternate:last-child')?.click());

    month = await page.$eval(name, (el) => el.month);
    year = await page.$eval(name, (el) => el.year);

    expect(month).toEqual(0);
    expect(year).toEqual(2022);

    // Back to previous month
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.month-view-btn-previous')?.click());

    year = await page.$eval(name, (el) => el.year);

    expect(year).toEqual(2021);
  });

  it('should support changing locale', async () => {
    await page.evaluate((el) => {
      const container = document.querySelector('ids-container');
      const component = document.querySelector(el);

      component.month = 11;
      component.year = 2021;
      component.day = 22;
      component.firstDayOfWeek = 0;

      container.setLocale('ar-SA');
      container.setLanguage('ar');
    }, name);

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
