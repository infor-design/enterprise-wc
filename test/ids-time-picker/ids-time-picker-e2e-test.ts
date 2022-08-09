import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Time Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-time-picker/example.html';
  const axeUrl = 'http://localhost:4444/ids-time-picker/open.html';

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['aria-valid-attr']).analyze();
    // Using newer aria-description for ids-dropdown
    expect(results.violations.length).toBe(0);
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

  it('setting the language will update the labels', async () => {
    await page.$eval('#e2e-timepicker-required', (el: any) => {
      el?.setAttribute('format', 'hh:mm:ss a');
    });

    const getLabels = async (): Promise<any> => {
      const labels: Promise<any> = await page.$eval(
        '#e2e-timepicker-required',
        (el: any) => ({
          hours: el?.container.querySelector('ids-dropdown#hours')?.label,
          minutes: el?.container.querySelector('ids-dropdown#minutes')?.label,
          seconds: el?.container.querySelector('ids-dropdown#seconds')?.label,
          period: el?.container.querySelector('ids-dropdown#period')?.label
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
        await container.setLocale('de-DE');
        await container.setLanguage('de');
      }
    });

    expect((await getLabels() as any).hours).toBe('Stunden');
    expect((await getLabels() as any).minutes).toBe('Minuten');
    expect((await getLabels() as any).seconds).toBe('Sekunden');
    expect((await getLabels() as any).period).toBe('Zeitraum');
  });

  it('setting the locale will update the dropdowns and field', async () => {
    await page.evaluate(async () => {
      const container: any = document.querySelector('ids-container');
      const component: any = document.querySelector('#e2e-timepicker-required');

      if (container) {
        await container.setLocale('en-US');
        await container.setLanguage('en');
      }

      if (component) {
        component.format = null;
        component.open();
      }
    });

    const getDropdowns = async (): Promise<any> => {
      const dropdowns: Promise<any> = await page.$eval(
        '#e2e-timepicker-required',
        (el: any) => ({
          hours: el?.container.querySelector('ids-dropdown#hours')?.label,
          minutes: el?.container.querySelector('ids-dropdown#minutes')?.label,
          seconds: el?.container.querySelector('ids-dropdown#seconds')?.label,
          period: el?.container.querySelector('ids-dropdown#period')?.label
        })
      );

      return dropdowns;
    };

    // h:mm a
    expect((await getDropdowns() as any).hours).toBeDefined();
    expect((await getDropdowns() as any).minutes).toBeDefined();
    expect((await getDropdowns() as any).seconds).not.toBeDefined();
    expect((await getDropdowns() as any).period).toBeDefined();

    await page.evaluate(async () => {
      const container: any = document.querySelector('ids-container');

      if (container) {
        await container.setLocale('fr-CA');
        await container.setLanguage('fr');
      }
    });

    // 'HH:mm'
    expect((await getDropdowns() as any).hours).toBeDefined();
    expect((await getDropdowns() as any).minutes).toBeDefined();
    expect((await getDropdowns() as any).seconds).not.toBeDefined();
    expect((await getDropdowns() as any).period).not.toBeDefined();

    // custom hh:mm:ss a
    await page.$eval('#e2e-timepicker-required', (el: any) => {
      el?.setAttribute('format', 'hh:mm:ss a');
    });

    expect((await getDropdowns() as any).hours).toBeDefined();
    expect((await getDropdowns() as any).minutes).toBeDefined();
    expect((await getDropdowns() as any).seconds).toBeDefined();
    expect((await getDropdowns() as any).period).toBeDefined();
  });
});
