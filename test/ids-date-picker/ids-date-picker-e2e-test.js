describe('Ids Date Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-date-picker';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Date Picker Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests();
  });

  it('should handle calendar popup events', async () => {
    // Closed before
    let isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    await page.waitForTimeout(200);
    expect(isOpen).toBeTruthy();

    // Click to itself
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.click());

    isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeTruthy();

    // Click outside
    await page.evaluate(() => {
      document.querySelector('ids-container')?.click();
    });

    isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();

    // Keyboard
    const input = await page.evaluateHandle('document.querySelector("#e2e-datepicker-value").shadowRoot.querySelector("ids-input")');
    await input?.focus();
    await page.keyboard.press('ArrowDown');

    isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeTruthy();

    await page.keyboard.press('Escape');

    isOpen = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();
  });

  it('should set correct date to the calendar popup', async () => {
    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    let year = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.year);
    let month = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.month);
    let day = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(2016);
    expect(month).toEqual(2);
    expect(day).toEqual(4);

    // Changing date via input
    await page.evaluate(() => {
      document.querySelector('ids-container')?.click();
      document.querySelector('#e2e-datepicker-value')?.setAttribute('value', '1/23/2022');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(2022);
    expect(month).toEqual(0);
    expect(day).toEqual(23);

    // Clear input value
    await page.evaluate(() => {
      document.querySelector('ids-container')?.click();
      document.querySelector('#e2e-datepicker-value')?.setAttribute('value', '');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.day);

    const now = new Date();

    expect(year).toEqual(now.getFullYear());
    expect(month).toEqual(now.getMonth());
    expect(day).toEqual(now.getDate());

    // No value with placeholder
    // Open popup
    await page.$eval('#e2e-datepicker-required', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-required', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-required', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-required', (el) =>
      el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(now.getFullYear());
    expect(month).toEqual(now.getMonth());
    expect(day).toEqual(now.getDate());
  });

  it('calendar popup should set correct input date value', async () => {
    await page.evaluate(() => {
      document.querySelector('ids-container')?.click();
      document.querySelector('#e2e-datepicker-value')?.setAttribute('value', '3/4/2016');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    // Click to calendar day
    await page.evaluate(() => {
      const component = document.querySelector('#e2e-datepicker-value');
      const monthView = component?.shadowRoot.querySelector('ids-month-view');
      const day = monthView?.shadowRoot.querySelector('td[data-day="31"]');
      day?.click();
    });

    let value = await page.$eval('#e2e-datepicker-value', (el) => el?.value);

    expect(value).toEqual('3/31/2016');

    // Apply button
    await page.evaluate(() => {
      const component = document.querySelector('#e2e-datepicker-value');
      const monthView = component?.shadowRoot.querySelector('ids-month-view');

      monthView.year = 2022;
      monthView.month = 2;
      monthView.day = 26;

      component?.shadowRoot.querySelector('.popup-btn-end')?.click();
    });

    value = await page.$eval('#e2e-datepicker-value', (el) => el?.value);

    expect(value).toEqual('3/26/2022');

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('ids-trigger-button')?.click());

    // Clear button
    await page.$eval('#e2e-datepicker-value', (el) =>
      el.shadowRoot.querySelector('.popup-btn-start')?.click());

    value = await page.$eval('#e2e-datepicker-value', (el) => el?.value);

    expect(value).toEqual('');
  });

  it('should change when used in calendar toolbar', async () => {
    // Add calendar toolbar datepicker
    await page.evaluate(() => {
      document.querySelector('ids-container').insertAdjacentHTML('afterbegin', `
        <ids-date-picker
          id="e2e-datepicker-toolbar"
          is-calendar-toolbar="true"
          value="is calendar toolbar"
          month="1"
          year="2022"
          day="25"
        ></ids-date-picker>
      `);
    });

    const hasCssClass = await page.$eval('#e2e-datepicker-toolbar', (el) =>
      el.container.classList.contains('is-calendar-toolbar'));
    const hasTabindex = await page.$eval('#e2e-datepicker-toolbar', (el) =>
      el.container.getAttribute('tabindex') === '0');
    const hasCancelBtn = await page.$eval('#e2e-datepicker-toolbar', (el) =>
      el.shadowRoot.querySelector('.popup-btn-start ids-text')?.textContent === 'Cancel');

    expect(hasCssClass).toBeTruthy();
    expect(hasTabindex).toBeTruthy();
    expect(hasCancelBtn).toBeTruthy();

    // Changing date doesn't change value
    await page.evaluate(() => {
      const component = document.querySelector('#e2e-datepicker-toolbar');

      component.month = 4;
      component.year = 2000;
      component.day = 22;
    });

    const value = await page.$eval('#e2e-datepicker-toolbar', (el) => el.value);

    expect(value).toEqual('is calendar toolbar');
  });

  it('should handle validation', async () => {
    let isRequired = await page.$eval('#e2e-datepicker-required', (el) => el.validate === 'required');
    let validationEvents = await page.$eval('#e2e-datepicker-required', (el) => el.validationEvents);

    expect(isRequired).toBeTruthy();
    expect(validationEvents).toEqual('change blur');

    await page.evaluate(() => {
      document.querySelector('#e2e-datepicker-required').validate = null;
      document.querySelector('#e2e-datepicker-required').validationEvents = null;
    });

    isRequired = await page.$eval('#e2e-datepicker-required', (el) => el.validate === 'required');
    validationEvents = await page.$eval('#e2e-datepicker-required', (el) => el.validationEvents);

    expect(isRequired).toBeFalsy();
    expect(validationEvents).toEqual('change blur');

    await page.evaluate(() => {
      document.querySelector('#e2e-datepicker-required').validationEvents = 'blur';
    });

    validationEvents = await page.$eval('#e2e-datepicker-required', (el) => el.validationEvents);

    expect(validationEvents).toEqual('blur');
  });

  it('should handle locale change', async () => {
    let firstDayOfWeek = await page.$eval('#e2e-datepicker-value', (el) => el.firstDayOfWeek);
    let isRtl = await page.$eval('#e2e-datepicker-value', (el) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeFalsy();
    expect(firstDayOfWeek).toEqual(0);

    await page.evaluate(() => {
      document.querySelector('ids-container')?.setLocale('ar-SA');
    });

    // Wait till calendars load
    await page.waitForFunction(() =>
      document.querySelector('ids-container')?.locale?.calendar().name === 'islamic-umalqura');

    isRtl = await page.$eval('#e2e-datepicker-value', (el) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeTruthy();

    await page.evaluate(() => {
      document.querySelector('ids-container')?.setLocale('ar-EG');
    });

    // Wait till calendars load
    await page.waitForFunction(() =>
      document.querySelector('ids-container')?.locale?.calendar().name === 'gregorian');

    firstDayOfWeek = await page.$eval('#e2e-datepicker-value', (el) => el.firstDayOfWeek);

    expect(firstDayOfWeek).toEqual(6);

    firstDayOfWeek = await page.$eval('#e2e-datepicker-required', (el) => el.firstDayOfWeek);

    expect(firstDayOfWeek).toEqual(1);

    await page.evaluate(() => {
      document.querySelector('ids-container')?.setLocale('en-US');
    });

    isRtl = await page.$eval('#e2e-datepicker-value', (el) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeFalsy();
  });
});
