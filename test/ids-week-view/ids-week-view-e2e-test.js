describe('Ids Week View e2e Tests', () => {
  const url = 'http://localhost:4444/ids-week-view';
  const name = 'ids-week-view';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Week View Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });

  it('should render one day and show correct day', async () => {
    // Set startDay = endDate to render one day view
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.startDate = '11/08/2021';
      element.endDate = '11/08/2021';
    }, name);

    // Has is-day-view css class
    const hasCssClass = await page.$eval(name, (el) =>
      Array.from(el.shadowRoot.querySelectorAll('.week-view-header-wrapper'))
        .every((item) => item.classList.contains('is-day-view')));

    // Day numeric element content
    const dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    // Weekday element content
    const weekDay = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:not(.is-emphasis)').textContent);

    // Month range in toolbar
    const monthYear = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.datepicker-text').textContent);

    expect(hasCssClass).toBeTruthy();
    expect(dayNumeric).toEqual('8');
    expect(weekDay).toEqual('Mon');
    expect(monthYear).toEqual('November 2021');
  });

  it('should change dates', async () => {
    // Previous date
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.week-view-btn-previous').click());

    let dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    let weekDay = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:not(.is-emphasis)').textContent);

    expect(dayNumeric).toEqual('7');
    expect(weekDay).toEqual('Sun');

    // Next date
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.week-view-btn-next').click());
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.week-view-btn-next').click());

    dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    weekDay = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:not(.is-emphasis)').textContent);

    expect(dayNumeric).toEqual('9');
    expect(weekDay).toEqual('Tue');

    // Today day
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.week-view-btn-today').click());

    dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    expect(+dayNumeric).toEqual(new Date().getDate());

    // Set regular week with different months to test month range and today button
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.startDate = '11/29/2021';
      element.endDate = '12/05/2021';
      element.firstDayOfWeek = 0;
    }, name);

    // Month range
    let monthYear = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.datepicker-text').textContent);

    expect(monthYear).toEqual('Nov - December 2021');

    // Click today
    await page.$eval(name, (el) => el.shadowRoot.querySelector('.week-view-btn-today').click());

    dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-wrapper.is-today .is-emphasis').textContent);

    expect(+dayNumeric).toEqual(new Date().getDate());

    // Set different years
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.startDate = '12/27/2021';
      element.endDate = '01/02/2022';
      element.firstDayOfWeek = 1;
    }, name);

    // Month range
    monthYear = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.datepicker-text').textContent);

    expect(monthYear).toEqual('Dec 2021 - Jan 2022');
  });

  it('should change locale', async () => {
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.startDate = '11/08/2021';
      element.endDate = '11/08/2021';
      element.setLocale('ar-SA');
      element.setLanguage('ar');
    }, name);

    // Wait till calendars loading
    await page.waitForFunction(() =>
      !document.querySelector('ids-week-view')
        .shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(1)')
        .classList.contains('is-emphasis'));

    const weekDayHasIsEmphasis = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(1)')
        .classList.contains('is-emphasis'));

    const dayNumericHasIsEmphasis = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(2)')
        .classList.contains('is-emphasis'));

    const dayNumeric = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    const weekDay = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-header-day-of-week:not(.is-emphasis)').textContent);

    expect(weekDayHasIsEmphasis).toBeFalsy();
    expect(dayNumericHasIsEmphasis).toBeTruthy();
    expect(dayNumeric).toEqual('٣');
    expect(weekDay).toEqual('الاثنين');
  });

  it('should hide timeline if current time is out of start/end hour range', async () => {
    // Change start/end hour to make timeline hidden
    await page.evaluate((el) => {
      const now = new Date();
      const hours = now.getHours();
      const startHour = hours >= 12 ? 6 : 18;
      const endHour = hours >= 12 ? 7 : 19;
      const element = document.querySelector(el);

      element.showTimeline = true;
      element.startHour = startHour;
      element.endHour = endHour;
    }, name);

    const timelineShiftCssVar = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-hour-row')?.style.cssText);

    expect(timelineShiftCssVar).toEqual('--timeline-shift: 0px;');
  });

  it('should show/hide timeline', async () => {
    // Hide timeline
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.showTimeline = false;
    }, name);

    let timeline = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-time-marker'));

    expect(timeline).toBeNull();

    // Show timeline
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      element.showTimeline = true;
    }, name);

    timeline = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-time-marker'));

    expect(timeline).not.toBeNull();
  });

  it('should change timeline position with interval', async () => {
    // Show timeline and change interval
    await page.evaluate((el) => {
      const element = document.querySelector(el);

      // Set small timeline interval to test position change
      element.timelineInterval = 500;
    }, name);

    const positionBefore = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-hour-row')?.dataset.diffInMilliseconds);

    await page.waitForTimeout(1000);

    const positionAfter = await page.$eval(name, (el) =>
      el.shadowRoot.querySelector('.week-view-hour-row')?.dataset.diffInMilliseconds);

    expect(positionBefore).not.toEqual(positionAfter);
  });
});
