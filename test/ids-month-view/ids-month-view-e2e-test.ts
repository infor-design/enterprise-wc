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
    await (expect(page) as any).toPassAxeTests();
  });

  it('should display correct number of days in a month', async () => {
    // Initial month
    let day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    let month = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    let year = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    let dayText = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    let numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(+day).toEqual(15);
    expect(+month).toEqual(10);
    expect(+year).toEqual(2021);
    expect(+dayText).toEqual(15);
    expect(numberOfDays).toEqual(30);

    // Changing date
    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      component.month = 1;
      component.year = 2000;
      component.day = 1;
    }, name);

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    month = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    year = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    dayText = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(+day).toEqual(1);
    expect(+month).toEqual(1);
    expect(+year).toEqual(2000);
    expect(+dayText).toEqual(1);
    expect(numberOfDays).toEqual(29);

    // Move to current month
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-today')?.click());

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    month = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    year = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    dayText = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    const now = new Date();

    expect(+day).toEqual(now.getDate());
    expect(+month).toEqual(now.getMonth());
    expect(+year).toEqual(now.getFullYear());
    expect(+dayText).toEqual(now.getDate());
    expect(numberOfDays).toEqual(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  });

  it('should be selectable', async () => {
    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      component.month = 11;
      component.year = 2021;
      component.day = 20;
    }, name);

    // Click on prev month day
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.alternate')?.click());

    // Should change to prev month
    let month = await page.$eval(name, (el: any) => el.month);
    let year = await page.$eval(name, (el: any) => el.year);

    expect(month).toEqual(10);
    expect(year).toEqual(2021);

    // Back to initial month and click to next month day
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-next')?.click());
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.alternate:last-child')?.click());

    month = await page.$eval(name, (el: any) => el.month);
    year = await page.$eval(name, (el: any) => el.year);

    expect(month).toEqual(0);
    expect(year).toEqual(2022);

    // Back to previous month
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-previous')?.click());

    year = await page.$eval(name, (el: any) => el.year);

    expect(year).toEqual(2021);

    // Should ignore click to selected day
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected')?.click());

    const selectedClick = await page.$eval(name, (el: any) => {
      el.shadowRoot.querySelector('td.is-selected')?.click();

      return el.shadowRoot.querySelector('td.is-selected').getAttribute('role', 'gridcell');
    });

    expect(selectedClick).toBeTruthy();
  });

  it('should support changing locale', async () => {
    await page.evaluate((el: any) => {
      const container: any = document.querySelector('ids-container');
      const component: any = document.querySelector(el);

      component.month = 11;
      component.year = 2021;
      component.day = 22;
      component.firstDayOfWeek = 0;

      container.setLocale('ar-SA');
      container.setLanguage('ar');
    }, name);

    // Wait till calendars load
    await page.waitForFunction(() => (document as any).querySelector('ids-month-view')?.locale?.calendar().name === 'islamic-umalqura');

    // RTL check
    let isRtl = await page.$eval(name, (el: any) => el.getAttribute('dir') === 'rtl');

    expect(isRtl).toBeTruthy();

    // Selected day
    const day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.day);
    const month = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.month);
    const year = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').dataset.year);
    const localeDay = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(22);
    expect(+month).toEqual(11);
    expect(+year).toEqual(2021);
    expect(+localeDay).toEqual(18);

    // Number of days in given month
    let numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(30);

    // Prev month
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-previous')?.click());

    numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(29);

    // Back to initial month and next month
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-next')?.click());
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-next')?.click());

    numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelectorAll('td:not(.alternate)').length);

    expect(numberOfDays).toEqual(29);

    // Selectable
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td:not(.alternate)')?.click());

    numberOfDays = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected')?.textContent);

    expect(+numberOfDays).toEqual(1);

    await page.evaluate(() => {
      const container: any = document.querySelector('ids-container');

      container.setLocale('en-US');
      container.setLanguage('en');
    });

    // Wait till calendars load
    await page.waitForFunction(() => (document as any).querySelector('ids-month-view')?.locale?.calendar().name === 'gregorian');

    // RTL check
    isRtl = await page.$eval(name, (el: any) => el.getAttribute('dir'));

    expect(isRtl).toBeNull();
  });

  it('should trigger compact view and today button', async () => {
    let hasFullSizeClass = await page.$eval(name, (el: any) => el.container.classList.contains('is-fullsize'));

    expect(hasFullSizeClass).toBeTruthy();

    // Make it compact
    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      element.compact = true;
    }, name);

    hasFullSizeClass = await page.$eval(name, (el: any) => el.container.classList.contains('is-fullsize'));
    const hasCompactClass = await page.$eval(name, (el: any) => el.container.classList.contains('is-compact'));

    expect(hasFullSizeClass).toBeFalsy();
    expect(hasCompactClass).toBeTruthy();

    // If weekdays have narrow format
    const isNarrow = await page.$eval(name, (el: any) => {
      const weekDayList = el.shadowRoot.querySelectorAll('.month-view-table-header ids-text');

      return Array.from(weekDayList).every((item: any) => item.textContent.length === 1);
    });

    expect(isNarrow).toBeTruthy();

    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      element.compact = false;
    }, name);

    // Hide Today button
    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      component.showToday = false;
    }, name);

    const hasTodayBtn = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.btn-today'));

    expect(hasTodayBtn).toBeNull();
  });

  it('should handle display range dates', async () => {
    // Toolbar
    let toolbar = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('ids-toolbar'));

    expect(toolbar).not.toBeNull();

    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      component.startDate = '02/04/2021';
      component.endDate = '04/04/2021';
    }, name);

    toolbar = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('ids-toolbar'));

    expect(toolbar).toBeNull();

    // Selectable
    let selected = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected'));

    // Click to tr element within tbody
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('tbody tr')?.click());

    expect(selected).toBeNull();

    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td:not(.is-disabled)')?.click());

    // Selectable
    selected = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected'));

    expect(selected).not.toBeNull();
  });

  it('should handle keyboard shortcuts (gregorian calendar)', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.setRequestInterception(false);

    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected')?.click());

    // Arrow Left - previous day
    await page.keyboard.press('ArrowLeft');

    let day = await page.$eval(name, (el: any) => el.day);

    expect(day).toEqual(14);

    // Arrow Right and '+' - next day after initial
    await page.keyboard.press('ArrowRight');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.press('Equal');
    await page.keyboard.up('ShiftLeft');

    day = await page.$eval(name, (el: any) => el.day);

    expect(day).toEqual(16);

    // Arrow Up - prev week and up to prev month
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    day = await page.$eval(name, (el: any) => el.day);
    let month = await page.$eval(name, (el: any) => el.month);

    expect(day).toEqual(26);
    expect(month).toEqual(9);

    // Arrow Down - back to initial month and to the next week after initial
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    day = await page.$eval(name, (el: any) => el.day);

    expect(day).toEqual(23);

    // End - last day of the month
    await page.keyboard.press('End');

    day = await page.$eval(name, (el: any) => el.day);

    expect(day).toEqual(30);

    // Home - first day of the month
    await page.keyboard.press('Home');

    day = await page.$eval(name, (el: any) => el.day);

    expect(day).toEqual(1);

    // '-' key - prev day and to the last day of previous month
    await page.keyboard.press('Minus');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);

    expect(day).toEqual(31);
    expect(month).toEqual(9);

    // Page Down - next month
    await page.keyboard.press('PageDown');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);

    // 31 -> 1 since the month has 30 days
    expect(day).toEqual(1);
    expect(month).toEqual(10);

    // To the end of current month and next day to the next month
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowRight');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);

    expect(day).toEqual(1);
    expect(month).toEqual(11);

    // To the end of current month and next week to the next year
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowDown');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);
    let year = await page.$eval(name, (el: any) => el.year);

    expect(day).toEqual(7);
    expect(month).toEqual(0);
    expect(year).toEqual(2022);

    await page.keyboard.press('PageUp');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);
    year = await page.$eval(name, (el: any) => el.year);

    expect(day).toEqual(7);
    expect(month).toEqual(11);
    expect(year).toEqual(2021);

    await page.keyboard.press('PageUp');

    month = await page.$eval(name, (el: any) => el.month);
    year = await page.$eval(name, (el: any) => el.year);

    expect(month).toEqual(10);
    expect(year).toEqual(2021);

    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');

    month = await page.$eval(name, (el: any) => el.month);
    year = await page.$eval(name, (el: any) => el.year);

    expect(month).toEqual(0);
    expect(year).toEqual(2022);

    // Prev year
    await page.keyboard.down('Control');
    await page.keyboard.press('PageUp');
    await page.keyboard.up('Control');

    year = await page.$eval(name, (el: any) => el.year);

    expect(year).toEqual(2021);

    // Next year
    await page.keyboard.down('Control');
    await page.keyboard.press('PageDown');
    await page.keyboard.up('Control');

    year = await page.$eval(name, (el: any) => el.year);

    expect(year).toEqual(2022);

    // Today
    await page.keyboard.press('t');

    day = await page.$eval(name, (el: any) => el.day);
    month = await page.$eval(name, (el: any) => el.month);
    year = await page.$eval(name, (el: any) => el.year);

    const now = new Date();

    expect(day).toEqual(now.getDate());
    expect(month).toEqual(now.getMonth());
    expect(year).toEqual(now.getFullYear());
  });

  it('should handle month/year picklist when compact', async () => {
    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      if (component) {
        component.compact = true;
        component.month = 10;
        component.year = 2021;
        component.day = 15;
        component.shadowRoot.querySelector('ids-date-picker')?.setAttribute('month', 0);
        component.shadowRoot.querySelector('ids-date-picker')?.setAttribute('year', 2022);
        component.shadowRoot.querySelector('ids-date-picker')?.setAttribute('expanded', true);
      }
    }, name);

    const btnTodayHidden = await page.$eval(name, (el: any) => el?.container.querySelector('.btn-today').hasAttribute('hidden'));
    const btnPrevHidden = await page.$eval(name, (el: any) => el?.container.querySelector('.btn-previous').hasAttribute('hidden'));
    const btnNextHidden = await page.$eval(name, (el: any) => el?.container.querySelector('.btn-next').hasAttribute('hidden'));
    const btnApplyHidden = await page.$eval(name, (el: any) => el?.container.querySelector('.btn-apply').hasAttribute('hidden'));

    expect(btnTodayHidden).toBeTruthy();
    expect(btnPrevHidden).toBeTruthy();
    expect(btnNextHidden).toBeTruthy();
    expect(btnApplyHidden).toBeFalsy();

    // Apply picklist date to month view
    await page.$eval(name, (el: any) => el?.container.querySelector('.btn-apply')?.click());

    const month = await page.$eval(name, (el: any) => el?.month);
    const year = await page.$eval(name, (el: any) => el?.year);

    expect(+month).toEqual(0);
    expect(+year).toEqual(2022);
  });

  it('should handle keyboard shortcuts (umalqura calendar)', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.setRequestInterception(false);

    // Reset and get calendar months
    await page.evaluate(() => {
      (document as any).querySelector('ids-container').setLocale('ar-SA');
      (document as any).querySelector('ids-container').setLanguage('ar');
    });

    // Wait till calendars load
    await page.waitForFunction(() => (document as any).querySelector('ids-container')?.locale?.calendar().name === 'islamic-umalqura');

    const months = await page.$eval(name, (el: any) => el.locale?.calendar()?.months.wide);

    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected')?.click());

    // Arrow Left - previous day
    await page.keyboard.press('ArrowLeft');

    let day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(9);

    // Arrow Right and '+' - next day after initial
    await page.keyboard.press('ArrowRight');
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.press('Equal');
    await page.keyboard.up('ShiftLeft');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(11);

    // Arrow Up - prev week and up to prev month
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    let dateLabel = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').ariaLabel);

    expect(+day).toEqual(27);
    // Indicates month change
    expect(dateLabel).toContain(months[2]);

    // End - last day of the month
    await page.keyboard.press('End');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(30);

    // Home - first day of the month
    await page.keyboard.press('Home');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);

    expect(+day).toEqual(1);

    // '-' key - prev day and to the last day of previous month
    await page.keyboard.press('Minus');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    dateLabel = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').ariaLabel);

    expect(+day).toEqual(29);
    expect(dateLabel).toContain(months[1]);

    // Page Down - next month
    await page.keyboard.press('PageDown');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    dateLabel = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').ariaLabel);

    expect(+day).toEqual(29);
    expect(dateLabel).toContain(months[2]);

    // Prev year
    await page.keyboard.down('Control');
    await page.keyboard.press('PageUp');
    await page.keyboard.up('Control');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    dateLabel = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').ariaLabel);

    expect(+day).toEqual(29);
    expect(dateLabel).toContain(months[2]);

    // Next year
    await page.keyboard.down('Control');
    await page.keyboard.press('PageDown');
    await page.keyboard.up('Control');

    day = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').textContent);
    dateLabel = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected').ariaLabel);

    expect(+day).toEqual(29);
    expect(dateLabel).toContain(months[2]);
  });

  it('should throw error when invalid legend format is provided', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.setRequestInterception(false);

    let hasError = false;

    page.on('error', () => {});
    page.on('pageerror', () => {});

    // Add empty erray as legend - throws the error
    try {
      await page.evaluate((el: any) => {
        const element = document.querySelector(el);

        if (element) {
          element.legend = [];
        }
      }, name);
    } catch (err) {
      hasError = true;
    }

    expect(hasError).toBeTruthy();
  });

  it('should handle legend items', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.setRequestInterception(false);
    const legend = [
      {
        name: 'Public Holiday',
        color: 'emerald-60',
        dates: ['11/15/2021', '11/16/2021', '11/17/2021'],
      },
      { name: 'Weekends', color: 'amber-60', dayOfWeek: [0] },
      {
        name: 'Full Days',
        color: '#1677ee',
        dates: ['11/24/2021', '11/25/2021'],
      }
    ];

    await page.evaluate((el: any, data: any) => {
      const element = document.querySelector(el);

      if (element) {
        element.legend = data;
      }
    }, name, legend);

    let containerHasClass = await page.$eval(name, (el: any) => el.container?.classList.contains('has-legend'));
    let numberOfItems = await page.$eval(name, (el: any) => el.container?.querySelectorAll('.month-view-legend-item')?.length);
    const legendColorFirstItem = await page.$eval(name, (el: any) => el.container?.querySelector('.month-view-legend-item:first-child .month-view-legend-swatch').getAttribute('style'));
    const legendTextFirstItem = await page.$eval(name, (el: any) => el.container?.querySelector('.month-view-legend-item:first-child .month-view-legend-text').textContent);
    const legendColorLastItem = await page.$eval(name, (el: any) => el.container?.querySelector('.month-view-legend-item:last-child .month-view-legend-swatch').getAttribute('style'));
    const legendTextLastItem = await page.$eval(name, (el: any) => el.container?.querySelector('.month-view-legend-item:last-child .month-view-legend-text').textContent);

    expect(containerHasClass).toBeTruthy();
    expect(numberOfItems).toBe(legend.length);
    expect(legendColorFirstItem).toEqual('--legend-color: var(--ids-color-palette-emerald-60);');
    expect(legendTextFirstItem).toEqual('Public Holiday');
    expect(legendColorLastItem).toEqual('--legend-color: #1677ee;');
    expect(legendTextLastItem).toEqual('Full Days');

    // Check dates
    const holidayByDate = await page.$eval(name, (el: any) => {
      const day = el.container?.querySelector('td[data-year="2021"][data-month="10"][data-day="15"]');
      const hasClass = day?.classList.contains('has-legend');
      const hasStyle = day?.getAttribute('style') === '--legend-color: var(--ids-color-palette-emerald-60);';

      return hasClass && hasStyle;
    });

    expect(holidayByDate).toBeTruthy();

    const fullDayByDate = await page.$eval(name, (el: any) => {
      const day = el.container?.querySelector('td[data-year="2021"][data-month="10"][data-day="24"]');
      const hasClass = day?.classList.contains('has-legend');
      const hasStyle = day?.getAttribute('style') === '--legend-color: #1677ee;';

      return hasClass && hasStyle;
    });

    expect(fullDayByDate).toBeTruthy();

    const weekendByDay = await page.$eval(name, (el: any) => {
      const days = el?.container.querySelectorAll('tr td:first-child');

      return Array.from(days)?.every((item: any) => item.classList.contains('has-legend')
        && item.getAttribute('style') === '--legend-color: var(--ids-color-palette-amber-60);');
    });

    expect(weekendByDay).toBeTruthy();

    // Remove legend
    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      if (element) {
        element.legend = null;
      }
    }, name);

    containerHasClass = await page.$eval(name, (el: any) => el.container?.classList.contains('has-legend'));
    numberOfItems = await page.$eval(name, (el: any) => el.container?.querySelectorAll('.month-view-legend-item')?.length);

    expect(containerHasClass).toBeFalsy();
    expect(numberOfItems).toEqual(0);
  });

  it('should handle range selection', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.setRequestInterception(false);

    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      if (element) {
        element.compact = true;
        element.useRange = true;
      }
    }, name);

    // Select a day and start the range selection
    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="1"]')?.click());

    let start = await page.$eval(name, (el: any) => el?.rangeSettings.start);

    expect(start).not.toBeNull();

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="4"]')?.click());

    let end = await page.$eval(name, (el: any) => el?.rangeSettings.end);

    expect(end).not.toBeNull();

    let selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(selected).toEqual(4);

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="16"]')?.click());

    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(end).toBeNull();
    expect(selected).toEqual(0);

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');

    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(end).not.toBeNull();
    expect(selected).toEqual(3);

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="16"]')?.click());

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(end).not.toBeNull();
    expect(selected).toEqual(3);

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="16"]')?.click());

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');

    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(end).not.toBeNull();
    expect(selected).toEqual(8);

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="16"]')?.click());

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(end).not.toBeNull();
    expect(selected).toEqual(8);

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="2"]')?.click());

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');

    let rangeDay = await page.$eval(name, (el: any) => el?.container.querySelector('.range-prev')?.dataset.day);

    expect(+rangeDay).toEqual(1);

    await page.keyboard.press('Escape');

    start = await page.$eval(name, (el: any) => el?.rangeSettings.start);

    expect(start).toBeNull();

    await page.$eval(name, (el: any) => el?.container.querySelector('td[data-month="10"][data-year="2021"][data-day="29"]')?.click());

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    rangeDay = await page.$eval(name, (el: any) => el?.container.querySelector('.range-next')?.dataset.day);

    expect(+rangeDay).toEqual(30);

    // Range selection from settings
    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      if (element) {
        element.rangeSettings = {
          start: '11/1/2021',
          end: '11/4/2021'
        };
      }
    }, name);

    start = await page.$eval(name, (el: any) => el?.rangeSettings.start);
    end = await page.$eval(name, (el: any) => el?.rangeSettings.end);
    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);

    expect(start).not.toBeNull();
    expect(end).not.toBeNull();
    expect(selected).toEqual(4);

    // Range selection off
    await page.evaluate((el: any) => {
      document.querySelector(el)?.setAttribute('use-range', false);
    }, name);

    selected = await page.$eval(name, (el: any) => el?.container.querySelectorAll('.range-selection')?.length);
    expect(selected).toEqual(0);
  });
});
