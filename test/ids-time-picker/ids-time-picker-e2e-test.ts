import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

const getDropdownLabels = async (): Promise<any> => {
  const labels: Promise<any> = await page.$eval(
    '#e2e-timepicker-required',
    (el: any) => ({
      hours: el?.picker.container.querySelector('ids-dropdown#hours')?.label,
      minutes: el?.picker.container.querySelector('ids-dropdown#minutes')?.label,
      seconds: el?.picker.container.querySelector('ids-dropdown#seconds')?.label,
      period: el?.picker.container.querySelector('ids-dropdown#period')?.label
    })
  );
  return labels;
};

describe('Ids Time Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-time-picker/example.html';
  const axeUrl = 'http://localhost:4444/ids-time-picker/open.html';

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    await checkForAxeViolations(page, [
      'aria-valid-attr',
      'color-contrast'
    ]);
  });

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page.title()).resolves.toMatch('IDS Time Picker Component');
  });

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

  it.skip('setting the language will update the labels', async () => {
    await page.$eval('#e2e-timepicker-required', (el: any) => {
      el?.setAttribute('format', 'hh:mm:ss a');
    });

    const getLabels = async (): Promise<any> => {
      const labels: Promise<any> = await page.$eval(
        '#e2e-timepicker-required',
        (el: any) => ({
          hours: el?.picker.container.querySelector('ids-dropdown#hours')?.label,
          minutes: el?.picker.container.querySelector('ids-dropdown#minutes')?.label,
          seconds: el?.picker.container.querySelector('ids-dropdown#seconds')?.label,
          period: el?.picker.container.querySelector('ids-dropdown#period')?.label
        })
      );

      return labels;
    };

    expect((await getLabels() as any).hours).toBe('Hours');
    expect((await getLabels() as any).minutes).toBe('Minutes');
    expect((await getLabels() as any).seconds).toBe('Seconds');
    expect((await getLabels() as any).period).toBe('Period');

    await page.evaluate(async () => {
      const container: any = document.querySelector('ids-container');

      if (container) {
        // await IdsGlobal.getLocale().setLocale('de-DE');
        // await IdsGlobal.getLocale().setLanguage('de');
      }
    });

    expect((await getLabels() as any).hours).toBe('Stunden');
    expect((await getLabels() as any).minutes).toBe('Minuten');
    expect((await getLabels() as any).seconds).toBe('Sekunden');
    expect((await getLabels() as any).period).toBe('Zeitraum');
  });

  it.skip('setting the locale will update the dropdowns and field', async () => {
    await page.evaluate(async () => {
      const container: any = document.querySelector('ids-container');
      const component: any = document.querySelector('#e2e-timepicker-required');

      if (container) {
        // await IdsGlobal.getLocale().setLocale('en-US');
        // await IdsGlobal.getLocale().setLanguage('en');
      }

      if (component) {
        component.format = null;
        component.open();
      }
    });

    // h:mm a
    let thisDropdowns = (await getDropdownLabels() as any);
    expect(thisDropdowns.hours).toBeDefined();
    expect(thisDropdowns.minutes).toBeDefined();
    expect(thisDropdowns.seconds).not.toBeDefined();
    expect(thisDropdowns.period).toBeDefined();

    await page.evaluate(async () => {
      const container: any = document.querySelector('ids-container');

      if (container) {
        // await IdsGlobal.getLocale().setLocale('fr-CA');
        // await IdsGlobal.getLocale().setLanguage('fr');
      }
    });

    // 'HH:mm'
    thisDropdowns = await getDropdownLabels() as any;
    expect(thisDropdowns.hours).toBeDefined();
    expect(thisDropdowns.minutes).toBeDefined();
    expect(thisDropdowns.seconds).not.toBeDefined();
    expect(thisDropdowns.period).not.toBeDefined();

    // custom hh:mm:ss a
    await page.$eval('#e2e-timepicker-required', (el: any) => {
      el?.setAttribute('format', 'hh:mm:ss a');
    });

    thisDropdowns = await getDropdownLabels() as any;
    expect(thisDropdowns.hours).toBeDefined();
    expect(thisDropdowns.minutes).toBeDefined();
    expect(thisDropdowns.seconds).toBeDefined();
    expect(thisDropdowns.period).toBeDefined();
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      const template = `
        <ids-time-picker id="test" format="hh:mm" value="12:00"></ids-time-picker>
      `;
      document.body.insertAdjacentHTML('beforeend', template);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('can select a time from the time picker dropdowns', async () => {
    // Open the timepicker popup
    await page.$eval('#e2e-timepicker-required', (el: any) => {
      el.format = 'h:mm a';
      if (!el.picker) {
        throw new Error('cannot find IdsTimePickerPopup');
      }

      // Show picker popup and set values
      el.picker.show();
      el.picker.hours = '12';
      el.picker.minutes = '00';
      el.picker.period = 'pm';
      el.picker.value = '12:00 pm';

      // Trigger event and hide
      el.picker.triggerSelectedEvent();
      el.picker.hide();
    });

    // Check input for correct value
    const inputValue = await page.$eval('#e2e-timepicker-required', (el: any) => el.input.value);
    expect(inputValue).toBe('12:00 PM');
  });
});
