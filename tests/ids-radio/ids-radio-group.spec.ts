import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsRadio from '../../src/components/ids-radio/ids-radio';
import IdsRadioGroup from '../../src/components/ids-radio/ids-radio-group';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsRadioGroup tests', () => {
  const url = '/ids-radio/example.html';
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Radio Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      expect(exceptions).toBeNull();
    });
  });

  test.describe('functional tests', () => {
    let container: any;
    let rg: any;

    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';

        container = document.createElement('ids-container') as IdsContainer;
        const rb1 = document.createElement('ids-radio') as IdsRadio;
        const rb2 = document.createElement('ids-radio') as IdsRadio;
        const elem = document.createElement('ids-radio-group') as IdsRadioGroup;

        rb1.value = 'Test radio button 1';
        rb2.value = 'Test radio button 2';
        rb1.label = 'Test radio 1';
        rb2.label = 'Test radio 2';
        elem.label = 'Test radio group label';
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        container.appendChild(elem);
        document.body.appendChild(container);
      });

      await page.evaluate(() => {
        rg = document.querySelector<IdsRadioGroup>('ids-radio-group');
      });
    });

    test('should render as disabled', async ({ page }) => {
      rg = await page.evaluate(() => document.querySelector<IdsRadioGroup>('ids-radio-group'));
      const rgAttr = await page.evaluate(() => {
        rg = document.querySelector<IdsRadioGroup>('ids-radio-group');
        return rg?.getAttribute('disabled');
      });

      expect(rgAttr).toEqual(null);

      let groupDisabled = await page.evaluate(() => {
        const radioArr = Array.from(document.querySelectorAll('ids-radio'));
        return radioArr.map((radio) => radio.getAttribute('group-disabled'));
      });

      expect(groupDisabled).toEqual(Array(groupDisabled.length).fill(null));

      let rootEl: any = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });

      const rgDisabled = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group');
        return element.getAttribute('disabled');
      });

      expect(rootEl).not.toContain('disabled');
      expect(rgDisabled).toEqual(null);

      await page.evaluate(() => {
        rg.disabled = true;
      });

      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual('true');

      groupDisabled = await page.evaluate(() => {
        const radioArr = Array.from(document.querySelectorAll('ids-radio'));
        return radioArr.map((radio) => radio.getAttribute('group-disabled'));
      });

      expect(groupDisabled).toEqual(Array(groupDisabled.length).fill('true'));

      rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });

      expect(rootEl).toContain('disabled');
      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual('true');

      await page.evaluate(() => {
        rg.disabled = false;
      });

      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual(null);

      groupDisabled = await page.evaluate(() => {
        const radioArr = Array.from(document.querySelectorAll('ids-radio'));
        return radioArr.map((radio) => radio.getAttribute('group-disabled'));
      });

      expect(groupDisabled).toEqual(Array(groupDisabled.length).fill(null));

      rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });

      expect(rootEl).not.toContain('disabled');
      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual(null);
    });

    test('should add/remove require error', async ({ page }) => {
      await page.evaluate(() => {
        rg.setAttribute('validate', 'required');
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.validate)).toEqual('required');
      expect(await page.evaluate(() => rg.labelEl.classList.contains('required'))).toEqual(true);
      expect(await page.evaluate(() => rg.shadowRoot.querySelector('.validation-message'))).toBeFalsy();

      await page.evaluate(() => rg.checkValidation());

      const msgEl = await page.evaluate(() => rg.shadowRoot.querySelector('.validation-message'));

      expect(msgEl).toBeTruthy();

      expect(await page.evaluate(() => rg.shadowRoot.querySelector('.validation-message').getAttribute('validation-id'))).toEqual('required');

      await page.evaluate(() => {
        rg = document.querySelector('ids-radio-group') as IdsRadioGroup;
        const rb1 = rg.querySelector('ids-radio');
        rg.makeChecked(rb1);
        rg.checkValidation();
      });

      expect(await page.evaluate(() => rg.shadowRoot.querySelector('.validation-message'))).toBeFalsy();
    });

    test('should set validation events', async ({ page }) => {
      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('validation-events'))).toEqual(null);

      await page.evaluate(() => {
        rg.validate = 'required';
        rg.validationEvents = 'blur';
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.getAttribute('validation-events'))).toEqual('blur');

      await page.evaluate(() => {
        rg.validationEvents = null;
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.getAttribute('validation-events'))).toEqual(null);

      await page.evaluate(() => {
        rg.validate = null;
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('validation-events'))).toEqual(null);
    });

    test('should set label required indicator', async ({ page }) => {
      const className = 'no-required-indicator';
      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('label-required'))).toEqual(null);

      let rootElem = await page.evaluate(() => {
        const element = rg.labelEl;
        return Array.from(element.classList);
      });

      expect(rootElem).not.toContain(className);

      await page.evaluate(() => {
        rg.validate = 'required';
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.getAttribute('label-required'))).toEqual(null);

      expect(rootElem).not.toContain(className);
      expect(await page.evaluate(() => rg.labelRequired)).toEqual(null);

      await page.evaluate(() => {
        rg.labelRequired = false;
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.getAttribute('label-required'))).toEqual(null);

      rootElem = await page.evaluate(() => {
        const element = rg.labelEl;
        return Array.from(element.classList);
      });

      expect(rootElem).toContain(className);
      expect(await page.evaluate(() => rg.labelRequired)).toEqual(null);

      await page.evaluate(() => {
        rg.labelRequired = true;
      });

      expect(await page.evaluate(() => rg.getAttribute('validate'))).toEqual('required');
      expect(await page.evaluate(() => rg.getAttribute('label-required'))).toEqual('true');

      rootElem = await page.evaluate(() => {
        const element = rg.labelEl;
        return Array.from(element.classList);
      });

      expect(rootElem).not.toContain(className);
      expect(await page.evaluate(() => rg.labelRequired)).toEqual('true');
    });

    test('should set label text', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        document.body.appendChild(elem);
        rg = document.querySelector<IdsRadioGroup>('ids-radio-group');
      });

      expect(await page.evaluate(() => rg.shadowRoot.querySelector('.group-label-text'))).toBeFalsy();

      await page.evaluate(() => {
        rg.label = 'test';
      });

      let labelVal: any = await page.evaluate(() => {
        const label: any = rg.shadowRoot.querySelector('.group-label-text');
        return label.textContent.trim();
      });
      expect(labelVal).toBe('test');

      await page.evaluate(() => {
        rg.label = 'test2';
      });

      labelVal = await page.evaluate(() => {
        const label: any = rg.shadowRoot.querySelector('.group-label-text');
        return label.textContent.trim();
      });
      expect(labelVal).toBe('test2');

      await page.evaluate(() => {
        rg.label = null;
      });
      expect(await page.evaluate(() => rg.shadowRoot.querySelector('.group-label-text'))).toBeFalsy();
    });

    test('should renders value', async ({ page }) => {
      let value: any = 'Test radio button 1';
      let rb1 = await page.evaluate(() => {
        value = 'Test radio button 1';
        return document.querySelector(`ids-radio[value="${value}"]`)?.getAttribute('checked');
      });
      expect(rb1).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual(null);

      await page.evaluate(() => {
        rg.value = value;
      });

      rb1 = await page.evaluate(() => document.querySelector(`ids-radio[value="${value}"]`)?.getAttribute('checked'));
      expect(rb1).toBe('true');
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual(value);

      await page.evaluate(() => {
        rg.value = null;
      });

      rb1 = await page.evaluate(() => document.querySelector(`ids-radio[value="${value}"]`)?.getAttribute('checked'));
      expect(rb1).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual(null);
    });

    test('should not renders wrong value', async ({ page }) => {
      let value: any = 'Test radio button 1';
      let rb1: any = await page.evaluate(() => {
        value = 'Test radio button 1';
        return document.querySelector(`ids-radio[value="${value}"]`)?.getAttribute('checked');
      });

      expect(rb1).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual(null);

      await page.evaluate(() => {
        const wrongVal = 'some other value';
        rg.value = wrongVal;
      });

      rb1 = await page.evaluate(() => document.querySelector(`ids-radio[value="${value}"]`)?.getAttribute('checked'));

      expect(rb1).toEqual(null);
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual(null);

      await page.evaluate(() => {
        rg.value = null;
      });
    });

    test('should set value', async ({ page }) => {
      let elem: IdsRadioGroup;
      let rb1: IdsRadio;
      let rb2: IdsRadio;
      let radioArr: any;

      await page.evaluate(() => {
        document.body.innerHTML = '';
        elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        rb1 = document.createElement('ids-radio') as IdsRadio;
        rb2 = document.createElement('ids-radio') as IdsRadio;

        rb1.setAttribute('value', 't1');
        rb1.setAttribute('checked', 'true');
        rb2.setAttribute('value', 't2');
        rb2.setAttribute('checked', 'true');
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        rg = document.body.appendChild(elem);
        rg.template();
        rg.setValue();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));

      expect(radioArr[0]).toEqual(null);
      expect(radioArr[1]).toEqual('true');
      expect(await page.evaluate(() => rg.getAttribute('value'))).toEqual('t2');

      await page.evaluate(() => {
        document.body.innerHTML = '';
        elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        rb1 = document.createElement('ids-radio') as IdsRadio;
        rb2 = document.createElement('ids-radio') as IdsRadio;
        rb1.setAttribute('checked', 'true');
        rb2.setAttribute('checked', 'true');
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        rg = document.body.appendChild(elem);
        rg.setAttribute('label', 'test');
        rg.setAttribute('label-required', 'false');
        rg.template();
        rg.setValue();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual(null);
      expect(radioArr[1]).toEqual('true');

      await page.evaluate(() => {
        document.body.innerHTML = '';
        elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        rb1 = document.createElement('ids-radio') as IdsRadio;
        rb2 = document.createElement('ids-radio') as IdsRadio;
        rb1.setAttribute('checked', 'true');
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        rg = document.body.appendChild(elem);
        rg.setAttribute('label', 'test');
        rg.template();
        rg.setValue();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual('true');
      expect(radioArr[1]).toEqual(null);

      await page.evaluate(() => {
        document.body.innerHTML = '';
        elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        rg = document.body.appendChild(elem);
        rg.template();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')]);
      expect(radioArr.length).toEqual(0);
    });

    test('should clear', async ({ page }) => {
      let radioArr: any;
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem = document.createElement('ids-radio-group') as IdsRadioGroup;
        const rb1 = document.createElement('ids-radio') as IdsRadio;
        const rb2 = document.createElement('ids-radio') as IdsRadio;
        rb1.setAttribute('checked', 'true');
        rb2.setAttribute('checked', 'true');
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        rg = document.body.appendChild(elem);
        rg.template();
        rg.setValue();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[1]).toEqual('true');

      await page.evaluate(() => {
        rg.clear();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual(null);
      expect(radioArr[1]).toEqual(null);
    });

    test('should make checked', async ({ page }) => {
      let radioArr: any = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual(null);
      expect(radioArr[1]).toEqual(null);

      await page.evaluate(() => {
        rg.makeChecked(rg.querySelector('ids-radio'));
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual('true');
      expect(radioArr[1]).toEqual(null);

      await page.evaluate(() => {
        radioArr = Array.from(rg.querySelectorAll('ids-radio'));
        radioArr[0].value = null;
        radioArr[1].value = null;
        rg.makeChecked(radioArr[0]);
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual('true');
      expect(radioArr[1]).toEqual(null);

      await page.evaluate(() => {
        rg.makeChecked();
      });

      radioArr = await page.evaluate(() => [...rg.querySelectorAll('ids-radio')].map((radio: any) => radio.getAttribute('checked')));
      expect(radioArr[0]).toEqual(null);
      expect(radioArr[1]).toEqual(null);
    });

    test('should render display horizontal', async ({ page }) => {
      let rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });
      expect(rootEl).not.toContain('horizontal');

      await page.evaluate(() => {
        rg.horizontal = true;
      });

      rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });
      expect(rootEl).toContain('horizontal');

      await page.evaluate(() => {
        rg.horizontal = false;
      });

      rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });
      expect(rootEl).not.toContain('horizontal');
      expect(await page.evaluate(() => rg.getAttribute('horizontal'))).toEqual(null);
      expect(await page.evaluate(() => rg.horizontal)).toEqual(false);
    });

    test('should trigger change event', async ({ page }) => {
      const responsePromise = await page.evaluate(() => new Promise((resolve) => {
        const radio = rg.querySelector('ids-radio') as IdsRadio;
        const evt = 'change';
        rg.addEventListener(evt, () => {
          resolve('triggered');
        });
        const event = new Event(evt);
        if (radio.input) {
          radio.input.dispatchEvent(event);
        }
      }));

      const response = await responsePromise;
      expect(response).toEqual('triggered');
    });

    test('should trigger key events', async ({ page }) => {
      const eventsToTest = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
      const calls: { [key: string]: number } = {};

      for (const eventName of eventsToTest) {
        calls[eventName] = await page.evaluate((event) => {
          const rb = document.querySelector<IdsRadio>('ids-radio');
          let eventCalls = 0;
          rb?.addEventListener(event, () => { eventCalls++; });
          const eventObj = new Event(event, { bubbles: true });
          rb?.dispatchEvent(eventObj);
          return eventCalls;
        }, eventName);
      }

      // Add assertions for each event
      expect(calls.ArrowDown).toBe(1);
      expect(calls.ArrowRight).toBe(1);
      expect(calls.ArrowUp).toBe(1);
      expect(calls.ArrowLeft).toBe(1);
      expect(calls.Space).toBe(1);
    });

    test('should render template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const html = '<ids-radio-group label="test" value="test-val" disabled="true" horizontal="true"></ids-radio-group>';
        document.body.innerHTML = html;
        rg = document.querySelector('ids-radio-group');
        rg.template();
      });

      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual('true');
      const rootEl = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });
      expect(rootEl).toContain('disabled');
      expect(rootEl).toContain('horizontal');
      expect(await page.evaluate(() => rg.getAttribute('horizontal'))).toEqual('true');
    });

    test('can change language from the container', async ({ page }) => {
      await page.evaluate(async () => {
        await window.IdsGlobal.locale?.setLanguage('de');
      });
      expect(await page.evaluate(() => rg.getAttribute('language'))).toEqual('de');
    });
  });
});
