describe('Ids Date Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-date-picker';
  const axeUrl = `${url}/axe.html`;

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests();
  });

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page.title()).resolves.toMatch('IDS Date Picker Component');
  });

  it('should handle calendar popup events', async () => {
    // Closed before
    let isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeTruthy();

    // Click to itself
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.click());

    isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeTruthy();

    // Click outside
    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.click();
    });

    isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();

    // Keyboard
    const input = await page.evaluateHandle('document.querySelector("#e2e-datepicker-value")');
    await input?.focus();
    await page.keyboard.press('ArrowDown');

    isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeTruthy();

    await page.keyboard.press('Escape');

    isOpen = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-popup')?.visible);

    expect(isOpen).toBeFalsy();

    // Loop focus inside the popup
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    let focusedElId = await page.evaluate(() => (document as any).activeElement.id);

    expect(focusedElId).toEqual('e2e-datepicker-value');

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.up('ShiftLeft');

    focusedElId = await page.evaluate(() => (document as any).activeElement.id);

    expect(focusedElId).toEqual('e2e-datepicker-value');
  });

  it('should set correct date to the calendar popup', async () => {
    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    let year = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.year);
    let month = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.month);
    let day = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(2016);
    expect(month).toEqual(2);
    expect(day).toEqual(4);

    // Changing date via input
    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.click();
      (document.querySelector as any)('#e2e-datepicker-value')?.setAttribute('value', '1/23/2022');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(2022);
    expect(month).toEqual(0);
    expect(day).toEqual(23);

    // Clear input value
    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.click();
      (document.querySelector as any)('#e2e-datepicker-value')?.setAttribute('value', '');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.day);

    const now = new Date();

    expect(year).toEqual(now.getFullYear());
    expect(month).toEqual(now.getMonth());
    expect(day).toEqual(now.getDate());

    // No value with placeholder
    // Open popup
    await page.$eval('#e2e-datepicker-required', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    year = await page.$eval('#e2e-datepicker-required', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.year);
    month = await page.$eval('#e2e-datepicker-required', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.month);
    day = await page.$eval('#e2e-datepicker-required', (el: any) => el.shadowRoot.querySelector('ids-month-view')?.day);

    expect(year).toEqual(now.getFullYear());
    expect(month).toEqual(now.getMonth());
    expect(day).toEqual(now.getDate());
  });

  it('calendar popup should set correct input date value', async () => {
    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.click();
      (document.querySelector as any)('#e2e-datepicker-value')?.setAttribute('value', '3/4/2016');
    });

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    // Click to calendar day
    await page.evaluate(() => {
      const component: any = (document.querySelector as any)('#e2e-datepicker-value');
      const monthView = component?.shadowRoot.querySelector('ids-month-view');
      const day = monthView?.shadowRoot.querySelector('td[data-day="31"]');
      day?.click();
    });

    let value = await page.$eval('#e2e-datepicker-value', (el: any) => el?.value);

    expect(value).toEqual('3/31/2016');

    // Apply button
    await page.evaluate(() => {
      const component: any = (document.querySelector as any)('#e2e-datepicker-value');
      const monthView = component?.shadowRoot.querySelector('ids-month-view');

      monthView.year = 2022;
      monthView.month = 2;
      monthView.day = 26;

      component?.shadowRoot.querySelector('.popup-btn-end')?.click();
    });

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el?.value);

    expect(value).toEqual('3/26/2022');

    // Open popup
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('ids-trigger-button')?.click());

    // Clear button
    await page.$eval('#e2e-datepicker-value', (el: any) => el.shadowRoot.querySelector('.popup-btn-start')?.click());

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el?.value);

    expect(value).toEqual('');
  });

  it('should change when used in calendar toolbar', async () => {
    // Add calendar toolbar datepicker
    await page.evaluate(() => {
      (document as any).querySelector('ids-container').insertAdjacentHTML('afterbegin', `
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

    const hasCssClass = await page.$eval('#e2e-datepicker-toolbar', (el: any) => el.container.classList.contains('is-calendar-toolbar'));
    const hasTabindex = await page.$eval('#e2e-datepicker-toolbar', (el: any) => el.container.getAttribute('tabindex') === '0');
    const hasCancelBtn = await page.$eval('#e2e-datepicker-toolbar', (el: any) => el.shadowRoot.querySelector('.popup-btn-start ids-text')?.textContent === 'Cancel');

    expect(hasCssClass).toBeTruthy();
    expect(hasTabindex).toBeTruthy();
    expect(hasCancelBtn).toBeTruthy();

    // Changing date doesn't change value
    await page.evaluate(() => {
      const component: any = (document.querySelector as any)('#e2e-datepicker-toolbar');

      component.month = 4;
      component.year = 2000;
      component.day = 22;
    });

    const value = await page.$eval('#e2e-datepicker-toolbar', (el: any) => el.value);

    expect(value).toEqual('is calendar toolbar');
  });

  it('should handle validation', async () => {
    let isRequired = await page.$eval('#e2e-datepicker-required', (el: any) => el.validate === 'required');
    let validationEvents = await page.$eval('#e2e-datepicker-required', (el: any) => el.validationEvents);

    expect(isRequired).toBeTruthy();
    expect(validationEvents).toEqual('change blur');

    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-datepicker-required').validate = null;
      (document.querySelector as any)('#e2e-datepicker-required').validationEvents = null;
    });

    isRequired = await page.$eval('#e2e-datepicker-required', (el: any) => el.validate === 'required');
    validationEvents = await page.$eval('#e2e-datepicker-required', (el: any) => el.validationEvents);

    expect(isRequired).toBeFalsy();
    expect(validationEvents).toEqual('change blur');

    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-datepicker-required').validationEvents = 'blur';
    });

    validationEvents = await page.$eval('#e2e-datepicker-required', (el: any) => el.validationEvents);

    expect(validationEvents).toEqual('blur');
  });

  it('should handle locale change', async () => {
    let firstDayOfWeek = await page.$eval('#e2e-datepicker-value', (el: any) => el.firstDayOfWeek);
    let isRtl = await page.$eval('#e2e-datepicker-value', (el: any) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeFalsy();
    expect(firstDayOfWeek).toEqual(0);

    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.setLocale('ar-SA');
    });

    // Wait till calendars load
    await page.waitForFunction(() => (document as any).querySelector('ids-container')?.locale?.calendar().name === 'islamic-umalqura');

    isRtl = await page.$eval('#e2e-datepicker-value', (el: any) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeTruthy();

    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.setLocale('ar-EG');
    });

    // Wait till calendars load
    await page.waitForFunction(() => (document as any).querySelector('ids-container')?.locale?.calendar().name === 'gregorian');

    firstDayOfWeek = await page.$eval('#e2e-datepicker-value', (el: any) => el.firstDayOfWeek);

    expect(firstDayOfWeek).toEqual(6);

    firstDayOfWeek = await page.$eval('#e2e-datepicker-required', (el: any) => el.firstDayOfWeek);

    expect(firstDayOfWeek).toEqual(1);

    await page.evaluate(() => {
      (document as any).querySelector('ids-container')?.setLocale('en-US');
    });

    isRtl = await page.$eval('#e2e-datepicker-value', (el: any) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeFalsy();
  });

  it('should change date on keyboard events', async () => {
    // Reset
    await page.evaluate(() => {
      const container = (document as any).querySelector('ids-container');
      const component = (document.querySelector as any)('#e2e-datepicker-value');

      container.setLocale('en-US');
      container.setLanguage('en');

      component.value = '3/4/2016';
    });

    await page.$eval('#e2e-datepicker-value', (el: any) => el?.click());

    await page.keyboard.press('Equal');

    let value = await page.$eval('#e2e-datepicker-value', (el: any) => el.value);

    expect(value).toEqual('3/5/2016');

    await page.keyboard.press('Minus');
    await page.keyboard.press('Minus');

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el.value);

    expect(value).toEqual('3/3/2016');

    await page.keyboard.press('KeyT');

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el.value);

    expect(value).toEqual(new Intl.DateTimeFormat('en-US').format(new Date()));

    await page.evaluate(() => {
      const component = (document.querySelector as any)('#e2e-datepicker-value');

      component.format = 'yyyy-MM-dd';
      component.value = '2021-10-18';
    });

    await page.keyboard.press('Minus');

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el.value);

    expect(value).toEqual('2021-10-18');

    await page.keyboard.press('Equal');

    value = await page.$eval('#e2e-datepicker-value', (el: any) => el.value);

    expect(value).toEqual('2021-10-18');
  });

  it('should handle month year picker events', async () => {
    await page.evaluate(() => {
      (document as any).querySelector('ids-container').insertAdjacentHTML(
        'afterbegin',
        '<ids-date-picker id="e2e-monthyear-picker" is-dropdown="true" value="January 2021" month="0" year="2021"></ids-date-picker>'
      );
    });

    const value = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.value);
    const month = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.month);
    const year = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.year);
    let expanded = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.expanded && el?.classList.contains('is-expaned'));

    // Check initial values
    expect(value).toEqual('January 2021');
    expect(month).toEqual(0);
    expect(year).toEqual(2021);
    expect(expanded).toBeFalsy();

    // Open/close picker with click to toggle button
    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('ids-toggle-button')?.click());

    expanded = await page.$eval('#e2e-monthyear-picker', (el: any) => el.expanded);

    expect(expanded).toBeTruthy();

    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('ids-toggle-button')?.click());

    expanded = await page.$eval('#e2e-monthyear-picker', (el: any) => el.expanded);

    expect(expanded).toBeFalsy();

    // Open with expanded property
    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-monthyear-picker').expanded = true;
    });

    expanded = await page.$eval('#e2e-monthyear-picker', (el: any) => el.expanded);

    expect(expanded).toBeTruthy();

    // Check month/year default selected in the list
    let monthSelectedIndex = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.dataset.month);
    let monthSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.textContent);
    let yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);

    expect(+monthSelectedIndex).toEqual(0);
    expect(monthSelectedText).toEqual('January');
    expect(yearSelectedText).toEqual('2021');

    // Changing month with keyboard
    await page.keyboard.press('ArrowUp');

    monthSelectedIndex = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.dataset.month);
    monthSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.textContent);

    expect(+monthSelectedIndex).toEqual(11);
    expect(monthSelectedText).toEqual('December');

    await page.keyboard.press('ArrowDown');

    monthSelectedIndex = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.dataset.month);
    monthSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.textContent);

    expect(+monthSelectedIndex).toEqual(0);
    expect(monthSelectedText).toEqual('January');

    // Changing year with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2011');

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2021');

    await page.keyboard.press('ArrowUp');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2026');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2031');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2027');

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2011');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2007');

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2021');

    await page.keyboard.press('ArrowUp');

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);

    expect(yearSelectedText).toEqual('2026');

    // Changing month/year by clicking to list items
    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month')?.click());
    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year')?.click());

    monthSelectedIndex = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.dataset.month);
    monthSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-month.is-selected')?.textContent);
    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);

    expect(+monthSelectedIndex).toEqual(0);
    expect(monthSelectedText).toEqual('January');
    expect(yearSelectedText).toEqual('2017');

    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-btn-up')?.click());

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2011');

    await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-btn-down')?.click());

    yearSelectedText = await page.$eval('#e2e-monthyear-picker', (el: any) => el.shadowRoot.querySelector('.picklist-item.is-year.is-selected')?.textContent);
    expect(yearSelectedText).toEqual('2021');

    // Legend doesn't apply if dropdown
    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-monthyear-picker').legend = [{ name: 'Holiday' }];
    });

    const legend = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.legend);

    expect(legend).not.toBeDefined();

    // Range settings don't apply if dropdown
    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-monthyear-picker').rangeSettings = { maxDays: 5 };
    });

    const rangeSettings = await page.$eval('#e2e-monthyear-picker', (el: any) => el?.rangeSettings);

    expect(rangeSettings).not.toBeDefined();

    // Picklist inside of a popup
    await page.evaluate(() => {
      const datePicker = (document.querySelector as any)('#e2e-datepicker-legend');
      const monthView = datePicker?.container.querySelector('ids-month-view');

      datePicker?.container.querySelector('ids-trigger-button')?.click();

      monthView?.container.querySelector('ids-date-picker')?.setAttribute('month', 0);
      monthView?.container.querySelector('ids-date-picker')?.setAttribute('year', 2022);
      monthView?.container.querySelector('ids-date-picker')?.setAttribute('expanded', true);
    });

    const btnStartText = await page.$eval(
      '#e2e-datepicker-legend',
      (el: any) => el?.container.querySelector('.popup-btn-start ids-text')?.textContent
    );

    expect(btnStartText).toEqual('Cancel');

    await page.$eval(
      '#e2e-datepicker-legend',
      (el: any) => el?.container.querySelector('.popup-btn-end')?.click()
    );

    const appliedToMonthView = await page.$eval(
      '#e2e-datepicker-legend',
      (el: any) => {
        const monthView = el?.container.querySelector('ids-month-view');

        return monthView?.month === 0 && monthView?.year === 2022;
      }
    );

    expect(appliedToMonthView).toBeTruthy();

    await page.$eval(
      '#e2e-datepicker-legend',
      (el: any) => el?.container.querySelector('.popup-btn-end')?.click()
    );

    const datePickerValue = await page.$eval(
      '#e2e-datepicker-legend',
      (el: any) => el?.value
    );

    expect(datePickerValue).toEqual('1/15/2022');
  });

  it('should handle range selection', async () => {
    // Settings range to value
    await page.evaluate(() => {
      (document as any).querySelector('ids-container').insertAdjacentHTML(
        'afterbegin',
        '<ids-date-picker id="e2e-range-picker" use-range="true" value="2/7/2018 - 2/22/2018"></ids-date-picker>'
      );

      (document.querySelector as any)('#e2e-range-picker').rangeSettings = {
        start: '2/3/2019',
        end: '3/15/2019'
      };
    });

    let value = await page.$eval('#e2e-range-picker', (el: any) => el?.value);

    expect(value).toEqual('2/3/2019 - 3/15/2019');

    // Value to range
    await page.evaluate(() => {
      (document.querySelector as any)('#e2e-range-picker').value = '3/4/2021 - 3/22/2021';
      (document.querySelector as any)('#e2e-range-picker')?.container.querySelector('ids-trigger-button')?.click();
    });

    const start = await page.$eval('#e2e-range-picker', (el: any) => el?.shadowRoot.querySelector('ids-month-view')?.rangeSettings.start?.getTime());
    const end = await page.$eval('#e2e-range-picker', (el: any) => el?.shadowRoot.querySelector('ids-month-view')?.rangeSettings.end?.getTime());

    expect(start).toEqual(new Date('3/4/2021').getTime());
    expect(end).toEqual(new Date('3/22/2021').getTime());

    // Today button
    const todayFormatted = await page.evaluate(() => {
      const container = (document as any).querySelector('ids-container');
      const formatted = container?.locale.formatDate(new Date());

      return `${formatted} - ${formatted}`;
    });

    await page.$eval(
      '#e2e-range-picker',
      (el: any) => el?.shadowRoot.querySelector('ids-month-view')?.container.querySelector('.btn-today')?.click()
    );

    value = await page.$eval('#e2e-range-picker', (el: any) => el?.value);

    expect(value).toEqual(todayFormatted);

    // Apply button
    await page.evaluate(() => {
      const component = (document.querySelector as any)('#e2e-range-picker');

      if (component) {
        component.container.querySelector('ids-trigger-button')?.click();
        component.rangeSettings = {
          start: null,
          end: null
        };
        component.container.querySelector('ids-month-view').month = 2;
        component.container.querySelector('ids-month-view').year = 2021;
        component.container.querySelector('ids-month-view').day = 22;
        component.rangeSettings = {
          start: '3/22/2021'
        };
        component.container.querySelector('.popup-btn-end')?.click();
      }
    });

    value = await page.$eval('#e2e-range-picker', (el: any) => el?.value);
    expect(value).toEqual('3/22/2021 - 3/22/2021');

    await page.evaluate(() => {
      const component = (document.querySelector as any)('#e2e-range-picker');

      if (component) {
        component.container.querySelector('ids-trigger-button')?.click();
        component.container.querySelector('ids-month-view').rangeSettings = {
          start: '1/2/2021',
          end: '1/25/2021'
        };
        component.container.querySelector('.popup-btn-end')?.click();
      }
    });

    value = await page.$eval('#e2e-range-picker', (el: any) => el?.value);
    expect(value).toEqual('1/2/2021 - 1/25/2021');
  });

  it('should change value on input value change', async () => {
    // Set value to the input
    await page.$eval(
      '#e2e-datepicker-required',
      (el: any) => el?.container.querySelector('ids-trigger-field')?.setAttribute('value', '4/5/2022')
    );

    let value = await page.$eval(
      '#e2e-datepicker-required',
      (el: any) => el?.value
    );

    expect(value).toEqual('4/5/2022');

    // Reset value in the input
    await page.$eval(
      '#e2e-datepicker-required',
      (el: any) => el?.container.querySelector('ids-trigger-field')?.setAttribute('value', '')
    );

    value = await page.$eval(
      '#e2e-datepicker-required',
      (el: any) => el?.value
    );

    expect(value).toEqual('');
  });
});
