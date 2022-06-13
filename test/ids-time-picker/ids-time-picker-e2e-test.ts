describe('Ids Time Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-time-picker/example.html';
  const axeUrl = 'http://localhost:4444/ids-time-picker/open.html';

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    // Using newer aria-description for ids-dropdown
    await (expect(page) as any).toPassAxeTests({ disabledRules: ['aria-valid-attr'] });
  });

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page.title()).resolves.toMatch('IDS Time Picker Component');
  });

  it('setting the language will update the labels', async () => {
    // timepicker.format = 'hh:mm:ss a';

    // const getLabel = (id: string) => timepicker?.container.querySelector(id)?.label;

    // expect(getLabel('#hours')).toBe('Hours');
    // expect(getLabel('#minutes')).toBe('Minutes');
    // expect(getLabel('#seconds')).toBe('Seconds');
    // expect(getLabel('#period')).toBe('Period');

    // await (document.querySelector('ids-container') as any).setLocale('de-DE');

    // timepicker.open();

    // expect(getLabel('#hours')).toBe('Stunden');
    // expect(getLabel('#minutes')).toBe('Minuten');
    // expect(getLabel('#seconds')).toBe('Sekunden');
    // expect(getLabel('#period')).toBe('Zeitraum');
  });

  // it.skip('setting the locale will update the dropdowns and field', () => {});

  it('should change value on input value change', async () => {
    // Set value to the input
    await page.$eval(
      '#e2e-timepicker-required',
      (el: any) => el?.container.querySelector('ids-trigger-field')?.setAttribute('value', '01:00 AM')
    );

    let value = await page.$eval(
      '#e2e-timepicker-required',
      (el: any) => el?.value
    );

    expect(value).toEqual('01:00 AM');

    // Reset value in the input
    await page.$eval(
      '#e2e-timepicker-required',
      (el: any) => el?.container.querySelector('ids-trigger-field')?.setAttribute('value', '')
    );

    value = await page.$eval(
      '#e2e-timepicker-required',
      (el: any) => el?.value
    );

    expect(value).toEqual('');
  });
});
