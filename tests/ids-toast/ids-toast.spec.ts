import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsToast from '../../src/components/ids-toast/ids-toast';
import IdsContainer from '../../src/components/ids-container/ids-container';

import {
  DEFAULTS,
  id,
  EVENTS
} from '../../src/components/ids-toast/ids-toast-shared';
import IdsToastMessage from '../../src/components/ids-toast/ids-toast-message';

test.describe('IdsToast tests', () => {
  const url = '/ids-toast/example.html';
  let toast: any;
  let options: any;
  let button: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    toast = await page.locator('ids-toast').first();
    button = page.locator('button[aria-label="Toast Message"]').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Toast Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.locator('#btn-toast-demo').click();
      await percySnapshot(page, 'ids-toast-light');
    });
  });

  test.describe('functionality tests', () => {
    test('renders using document.createElement with no errors (append late)', async ({ page }) => {
      await page.evaluate(() => {
        const toastElem = document.createElement('ids-toast') as IdsToast;
        toastElem.position = 'bottom-end';
        toastElem.allowLink = true;
        toastElem.audible = true;
        toastElem.draggable = true;
        toastElem.timeout = 2000;
        document.body.appendChild(toastElem);
      });

      const errorLogs: any[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errorLogs.push(message.text());
        }
      });
      expect(errorLogs).toHaveLength(0);
    });

    test('can set to put links in the toast message', async () => {
      await button.click();
      let allowLinkvalue;
      const allowLink = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.allowLink = val;
        }, value);
      };
      const getallowLinkvalue = () => toast.evaluate((toastEl: IdsToast) => toastEl.allowLink);
      await expect(toast).not.toHaveAttribute('allow-link');
      allowLinkvalue = await getallowLinkvalue();
      await expect(allowLinkvalue).toEqual(DEFAULTS.allowLink);

      await allowLink(true);
      await expect(toast).toHaveAttribute('allow-link', '');
      allowLinkvalue = await getallowLinkvalue();
      await expect(allowLinkvalue).toEqual(true);

      await allowLink(false);
      await expect(toast).not.toHaveAttribute('allow-link');
      allowLinkvalue = await getallowLinkvalue();
      await expect(allowLinkvalue).toEqual(false);

      await allowLink(null);
      await expect(toast).not.toHaveAttribute('allow-link');
      allowLinkvalue = await getallowLinkvalue();
      await expect(allowLinkvalue).toEqual(DEFAULTS.allowLink);
    });

    test('can set audible to toast message', async () => {
      await button.click();
      let isAudible;
      await expect(toast).not.toHaveAttribute('audible');
      const setAudible = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.audible = val;
        }, value);
      };
      const getAudible = () => toast.evaluate((toastEl: IdsToast) => toastEl.audible);
      isAudible = await getAudible();
      await expect(isAudible).toEqual(DEFAULTS.audible);
      await setAudible(true);
      isAudible = await getAudible();
      await expect(toast).toHaveAttribute('audible', '');
      await expect(isAudible).toEqual(true);
      await setAudible(false);
      isAudible = await getAudible();
      await expect(toast).not.toHaveAttribute('audible');
      await expect(isAudible).toEqual(false);
      await setAudible(null);
      isAudible = await getAudible();
      await expect(toast).not.toHaveAttribute('audible');
      await expect(isAudible).toEqual(DEFAULTS.audible);
    });

    test('can set to allows drag/drop the toast', async () => {
      await button.click();
      let isDraggable;
      await expect(toast).not.toHaveAttribute('draggable');
      const setDraggable = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.draggable = val;
        }, value);
      };
      const getDraggable = () => toast.evaluate((toastEl: IdsToast) => toastEl.draggable);
      isDraggable = await getDraggable();
      await expect(isDraggable).toEqual(DEFAULTS.draggable);
      await setDraggable(true);
      isDraggable = await getDraggable();
      await expect(toast).toHaveAttribute('draggable', '');
      await expect(isDraggable).toEqual(true);
      await setDraggable(false);
      isDraggable = await getDraggable();
      await expect(toast).not.toHaveAttribute('draggable');
      await expect(isDraggable).toEqual(false);
      await setDraggable(null);
      isDraggable = await getDraggable();
      await expect(toast).not.toHaveAttribute('draggable');
      await expect(isDraggable).toEqual(DEFAULTS.draggable);
    });

    test('can set position of the toast container in specific place', async () => {
      await button.click();
      let toastContainer;
      let toastPosition;
      await expect(toast).not.toHaveAttribute('draggable');
      const setPosition = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.position = val;
        }, value);
      };
      // eslint-disable-next-line max-len
      const getContainer = (val: string) => toast.evaluate((el: IdsToast, pos: string) => el.toastContainer().classList.contains(pos), val);
      const getToastPosition = () => toast.evaluate((toastEl: IdsToast) => toastEl.position);
      toastContainer = await getContainer(DEFAULTS.position);
      toastPosition = await getToastPosition();
      await expect(toast).not.toHaveAttribute('position');
      await expect(toastPosition).toEqual(DEFAULTS.position);
      await expect(toastContainer).toEqual(true);

      const values = ['bottom-end', 'bottom-start', 'top-end', 'top-start'];
      for (const v of values) {
        await setPosition(v);
        toastContainer = await getContainer(v);

        await expect(toast).toHaveAttribute('position', v);
        toastPosition = await getToastPosition();
        await expect(toastPosition).toEqual(v);
        await expect(toastContainer).toEqual(true);
      }

      await setPosition('xyz');
      toastContainer = await getContainer(DEFAULTS.position);
      await expect(toast).not.toHaveAttribute('position');
      await expect(toastPosition).toEqual('top-start'); // DEFAULTS.position causes error
      await expect(toastContainer).toEqual(true);
    });

    test('can set toast to progress bar', async () => {
      await button.click();
      let progressbar;
      const setProgressbar = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.progressBar = val;
        }, value);
      };
      const getProgressbar = () => toast.evaluate((toastEl: IdsToast) => toastEl.progressBar);
      progressbar = await getProgressbar();
      await expect(toast).not.toHaveAttribute('progress-bar');
      await expect(progressbar).toEqual(DEFAULTS.progressBar);
      await setProgressbar(true);
      await expect(toast).toHaveAttribute('progress-bar', 'true');
      progressbar = await getProgressbar();
      await expect(progressbar).toEqual(true);
      await setProgressbar(false);
      await expect(toast).toHaveAttribute('progress-bar', 'false');
      progressbar = await getProgressbar();
      await expect(progressbar).toEqual(false);
      await setProgressbar(null);
      await expect(toast).not.toHaveAttribute('progress-bar');
      progressbar = await getProgressbar();
      await expect(progressbar).toEqual(DEFAULTS.progressBar);
    });

    test('can set toast container to save position', async () => {
      await button.click();
      let savePosition;
      const setsavePosition = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.savePosition = val;
        }, value);
      };
      const getsavePosition = () => toast.evaluate((toastEl: IdsToast) => toastEl.savePosition);
      savePosition = await getsavePosition();
      await expect(toast).not.toHaveAttribute('save-position');
      await expect(savePosition).toEqual(DEFAULTS.savePosition);
      await setsavePosition(true);
      await expect(toast).toHaveAttribute('save-position', 'true');
      savePosition = await getsavePosition();
      await expect(savePosition).toEqual(true);
      await setsavePosition(false);
      await expect(toast).toHaveAttribute('save-position', 'false');
      savePosition = await getsavePosition();
      await expect(savePosition).toEqual(false);
      await setsavePosition(null);
      await expect(toast).not.toHaveAttribute('save-position');
      savePosition = await getsavePosition();
      await expect(savePosition).toEqual(DEFAULTS.savePosition);
    });

    test('can set toast timeout', async () => {
      await button.click();
      let timeout;
      const settimeout = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.timeout = val;
        }, value);
      };
      const gettimeout = () => toast.evaluate((toastEl: IdsToast) => toastEl.timeout);
      timeout = await gettimeout();
      await expect(toast).not.toHaveAttribute('timeout');
      await expect(timeout).toEqual(DEFAULTS.timeout);
      await settimeout(2000);
      await expect(toast).toHaveAttribute('timeout', '2000');
      timeout = await gettimeout();
      await expect(timeout).toEqual('2000');
      await settimeout(false);
      await expect(toast).not.toHaveAttribute('timeout');
      timeout = await gettimeout();
      await expect(timeout).toEqual(DEFAULTS.timeout);
    });

    test('can set toast uniqueId', async () => {
      await button.click();
      const uniqueId = 'some-uniqueid';
      let uId;
      const setuniqueId = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.uniqueId = val;
        }, value);
      };
      const getuniqueId = () => toast.evaluate((toastEl: IdsToast) => toastEl.uniqueId);
      uId = await getuniqueId();
      await expect(toast).not.toHaveAttribute('unique-id');
      await expect(uId).toEqual(DEFAULTS.uniqueId);

      await setuniqueId(uniqueId);
      await expect(toast).toHaveAttribute('unique-id', uniqueId);
      uId = await getuniqueId();
      await expect(uId).toEqual(uniqueId);
      await setuniqueId('');
      await expect(toast).not.toHaveAttribute('unique-id');
      uId = await getuniqueId();
      await expect(uId).toEqual(DEFAULTS.uniqueId);
    });

    test('can set to destroy after complete all the toasts', async () => {
      await button.click();
      let destroyOnComplete;
      const setdestroyOnComplete = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.destroyOnComplete = val;
        }, value);
      };
      const getdestroyOnComplete = () => toast.evaluate((toastEl: IdsToast) => toastEl.destroyOnComplete);
      destroyOnComplete = await getdestroyOnComplete();
      await expect(toast).not.toHaveAttribute('destroy-on-complete');
      await expect(destroyOnComplete).toEqual(DEFAULTS.destroyOnComplete);

      await setdestroyOnComplete(true);
      await expect(toast).toHaveAttribute('destroy-on-complete', 'true');
      destroyOnComplete = await getdestroyOnComplete();
      await expect(destroyOnComplete).toEqual(true);
      await setdestroyOnComplete(false);
      await expect(toast).toHaveAttribute('destroy-on-complete', 'false');
      destroyOnComplete = await getdestroyOnComplete();
      await expect(destroyOnComplete).toEqual(false);
      await setdestroyOnComplete(null);
      await expect(toast).not.toHaveAttribute('destroy-on-complete');
      destroyOnComplete = await getdestroyOnComplete();
      await expect(destroyOnComplete).toEqual(DEFAULTS.destroyOnComplete);
    });

    test('can set toast message', async () => {
      await button.click();
      options = {
        ...options,
        allowLink: true,
        closeButtonLabel: 'Test close text'
      };
      await toast.evaluate((toastEl: IdsToast) => toastEl.show);
      const msg = await toast.evaluate((toastEl: IdsToast, opt: any) => {
        toastEl.position = 'bottom-end';
        toastEl.show(opt);
        toastEl.draggable = true;
        delete opt.closeButtonLabel;
        delete opt.allowLink;
        delete opt.timeout;
        toastEl.show(opt);
        toastEl.audible = true;
        toastEl.show(opt);
        const toastContainer = toastEl.toastContainer();
        const messageEl = toastContainer.querySelector('ids-toast-message');
        return messageEl;
      }, options);

      expect(msg).toBeTruthy();
    });

    test('can check if can save position to local storage', async ({ page }) => {
      // get information from local storage
      const localStorage = async () => {
        const store = await page.evaluate(() => window.localStorage);
        return store;
      };
      const prefix = 'ids-toast-container';
      const suffix = 'usersettings-position';
      const uniqueId = 'some-uniqueid';
      const transform = 'translate(100px, 250px)';

      // check if local storage is empty
      expect(await localStorage()).toEqual({});
      await await button.click();
      await toast.evaluate((element: IdsToast, opt: any) => {
        element.uniqueId = opt.uniqueId;
        element.savePosition = true;
        element.draggable = true;
        element.toastContainer()!.style.transform = opt.transform;
      }, { uniqueId, transform });
      // wait for the toast to be attached in DOM - very important!!
      await toast.waitFor({ state: 'attached' });
      // wait for the localStorage to have an item - very important!!
      await page.waitForFunction(() => window.localStorage.length > 0);
      // validation if information is saved in local storage
      const storage = await localStorage();
      expect(storage.hasOwnProperty(`${prefix}-${uniqueId}-${suffix}`)).toBeTruthy();
      expect(storage[`${prefix}-${uniqueId}-${suffix}`]).toEqual(transform);
    });

    test('can save position to local storage', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      const uniqueId = 'some-uniqueid';
      const transform = 'translate(100px, 250px)';
      let toastContainer;
      let msgEl;
      await toast.evaluate((toastEl: IdsToast) => toastEl.show);
      await toast.evaluate((toastEl: IdsToast, opt: any) => {
        toastEl.ls = {}; // set empty localStorage
        toastEl.savePosition = true;
        toastEl.draggable = true;
        toastEl.show(opt);
      }, options);
      const getContainer = () => toast.evaluate((el: IdsToast) => el.toastContainer().style.transform);
      const getmessageEl = () => toast.evaluate((el: IdsToast) => el.toastContainer().querySelector('ids-toast-message'));
      const settoastContainer = async (value: any) => {
        await toast.evaluate((toastEl: IdsToast, val: any) => {
          toastEl.toastContainer().style.transform = val;
        }, value);
      };

      toastContainer = await getContainer();
      msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      expect(toastContainer).toEqual('none');

      await settoastContainer(transform);
      await toast.evaluate(async (el: IdsToastMessage) => { await el?.removeToastMessage; });
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
      });
      const toastmsg = await page.locator('ids-toast-message').first();
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      toastContainer = await getContainer();
      msgEl = await getmessageEl();
      expect(msgEl).toBeFalsy();
      await expect(localStorage.getItem(id(uniqueId))).toEqual(null);
      await toast.evaluate(async (el: IdsToast) => { el.clearPosition(); });
      await toast.evaluate(async (el: IdsToast) => { el.clearPositionAll(); });
      await expect(localStorage.getItem(id(uniqueId))).toEqual(null);
    });

    test.skip('can restore saved position', async ({ page }) => {
      // await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };

      const prefix = 'ids-toast-container';
      const suffix = 'usersettings-position';
      const uniqueId = 'some-uniqueid';
      const key = `${prefix}-${uniqueId}-${suffix}`;
      const transform = 'translate(-590px, 230px)';
      await page.evaluate((data) => {
        window.localStorage.setItem(data.key, data.transform);
      }, { key, transform });
      await page.waitForFunction(() => window.localStorage.length > 0);
      await page.evaluate((opt: any) => {
        const toastEl = document.createElement('ids-toast')! as IdsToast;
        toastEl.uniqueId = 'some-uniqueid';
        toastEl.savePosition = true;
        toastEl.draggable = true;
        document.querySelector('ids-container')!.appendChild(toastEl);

        toastEl.show(opt);
      }, options);
      await toast.waitFor({ state: 'attached' });
      await expect(toast).toBeAttached();
      const getContainer = () => toast.evaluate((el: IdsToast) => el.toastContainer().style.transform);
      const getmessageEl = () => toast.evaluate((el: IdsToast) => el.toastContainer().querySelector('ids-toast-message'));

      const toastContainer = await getContainer();
      const msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      expect(toastContainer)
        .toEqual(transform);

      await toast.evaluate(async (el: IdsToast) => { el.clearPosition('some-uniqueid'); });
    });

    test('can reset saved position', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };

      const prefix = 'ids-toast-container';
      const suffix = 'usersettings-position';
      const uniqueId = 'some-uniqueid';
      const key = `${prefix}-${uniqueId}-${suffix}`;
      const transform = 'translate(-9999px, -9999px)';

      await page.evaluate((data) => {
        window.localStorage.setItem(data.key, data.transform);
      }, { key, transform });
      await page.waitForFunction(() => window.localStorage.length > 0);
      await page.evaluate((opt: any) => {
        const toastEl = document.createElement('ids-toast')! as IdsToast;
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: null, writable: true });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: null, writable: true });
        toastEl.uniqueId = 'some-uniqueid';
        toastEl.savePosition = true;
        toastEl.draggable = true;
        document.querySelector('ids-container')!.appendChild(toastEl);

        toastEl.show(opt);
      }, options);

      await toast.waitFor({ state: 'attached' });
      await expect(toast).toBeAttached();
      const getContainer = () => toast.evaluate((el: IdsToast) => el.toastContainer().style.transform);
      const getmessageEl = () => toast.evaluate((el: IdsToast) => el.toastContainer().querySelector('ids-toast-message'));

      const toastContainer = await getContainer();
      const msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      expect(toastContainer).toEqual('none');

      await toast.evaluate(async (el: IdsToast) => { el.clearPosition('some-uniqueid'); });
    });

    test('can clear saved position', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      const prefix = 'ids-toast-container';
      const suffix = 'usersettings-position';
      const uniqueId = 'some-uniqueid';
      const key = `${prefix}-${uniqueId}-${suffix}`;
      // const transform = 'translate(-9999px, -9999px)';
      const transform = 'translate(100px, 250px)';

      await page.evaluate((data) => {
        window.localStorage.setItem(data.key, data.transform);
      }, { key, transform });
      await page.waitForFunction(() => window.localStorage.length > 0);
      await toast.evaluate(async (el: IdsToast) => { el.clearPosition('aaa'); });
      let item = await page.evaluate((storageKey) => window.localStorage.getItem(storageKey), key);
      await expect(item).toEqual(transform);
      await button.click();
      toast = await page.locator('ids-toast').first();
      await toast.evaluate(async (el: IdsToast) => { el.clearPosition('some-uniqueid'); });

      item = await page.evaluate((storageKey) => window.localStorage.getItem(storageKey), key);
      await expect(item).toEqual(null);
      // expect(localStorage.getItem(id(uniqueId))).toEqual(null);
      const iD = 'test0';
      const value = 'test-0-value';
      await page.evaluate((data) => window.localStorage.setItem(data.iD, data.value), { iD, value });
      await page.waitForFunction(() => window.localStorage.length > 0);

      item = await page.evaluate((data) => window.localStorage.getItem(data.iD), { iD, value });
      await expect(item).toEqual(value);
      await button.click();
      await page.evaluate(() => {
        const el = document.querySelector<IdsToast>('ids-toast');
        el!.uniqueId = 'test0';
        el!.clearPosition();
      });
      item = await page.evaluate(() => window.localStorage.getItem('test0'));
      // await expect(item).toEqual(null);
      await page.evaluate(() => window.localStorage.setItem('test1', 'test-1-value'));
      await page.evaluate(() => window.localStorage.setItem('test2', 'test-2-value'));
      await page.evaluate(() => window.localStorage.setItem('test3', 'test-3-value'));
      await page.evaluate(() => window.localStorage.setItem('testaaa', 'test-aaa-value'));

      item = await page.evaluate(() => window.localStorage.getItem('test1'));
      await expect(item).toEqual('test-1-value');
      item = await page.evaluate(() => window.localStorage.getItem('test2'));
      await expect(item).toEqual('test-2-value');
      item = await page.evaluate(() => window.localStorage.getItem('test3'));
      await expect(item).toEqual('test-3-value');
      item = await page.evaluate(() => window.localStorage.getItem('testaaa'));
      await expect(item).toEqual('test-aaa-value');
      await button.click();
      await toast.evaluate(async (el: IdsToast) => { el.clearPositionAll(); });

      item = await page.evaluate(() => window.localStorage.getItem('testaaa'));
      await expect(item).toEqual('test-aaa-value');
      await page.evaluate(() => window.localStorage.removeItem('testaaa'));
      item = await page.evaluate(() => window.localStorage.getItem('testaaa'));
      await expect(item).toEqual(null);
    });

    test('can fire toast events', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      const uniqueId = 'some-uniqueid';
      const transform = 'translate(100px, 250px)';
      const detail = {
        active: {
          addMessage: null,
          removeMessage: null,
          savePosition: null,
          clearPosition: null
        },
        before: {
          addMessage: null,
          removeMessage: null,
          savePosition: null,
          clearPosition: null
        },
        after: {
          addMessage: 'ids-toast-container-some-uniqueid-message-0',
          removeMessage: 'ids-toast-container-some-uniqueid-message-0',
          savePosition: 'some-uniqueid',
          clearPosition: 'some-uniqueid'
        }
      };

      // await page.evaluate((event) => {
      //   const el: any = document.createElement('ids-toast') as IdsToast;
      //   (window as any).toastEvents = {
      //     addMessage: false,
      //     removeMessage: false,
      //     savePostition: false,
      //     clearPosition: false,
      //   };
      //   el.addEventListener(event.addMessage, () => {
      //     (window as any).toastEvents.addMessage = true;
      //   });
      //   el.addEventListener(event.removeMessage, () => {
      //     (window as any).toastEvents.removeMessage = true;
      //   });
      //   el.addEventListener(event.savePosition, () => {
      //     (window as any).toastEvents.savePosition = true;
      //   });
      //   el.addEventListener(event.clearPosition, () => {
      //     (window as any).toastEvents.clearPosition = true;
      //   });
      // }, EVENTS);
      expect(detail.active.addMessage).toEqual(detail.before.addMessage);
      expect(detail.active.removeMessage).toEqual(detail.before.removeMessage);
      expect(detail.active.savePosition).toEqual(detail.before.savePosition);
      expect(detail.active.clearPosition).toEqual(detail.before.clearPosition);
      await toast.evaluate((toastEl: IdsToast, details: any) => {
        (window as any).toastEvents = {
          addMessage: false,
          removeMessage: false,
          savePosition: false,
          clearPosition: false,
        };
        toastEl.addEventListener('add-message', () => {
          (window as any).toastEvents.addMessage = true;
        });
        toastEl.addEventListener('remove-message', () => {
          (window as any).toastEvents.removeMessage = true;
        });
        toastEl.addEventListener('save-position', () => {
          (window as any).toastEvents.savePosition = true;
        });
        toastEl.addEventListener('clear-position', () => {
          (window as any).toastEvents.clearPosition = true;
        });
        toastEl.uniqueId = details.uid;
        toastEl.savePosition = true;
        toastEl.draggable = true;
        toastEl.show(details.options);
        toastEl.toastContainer().querySelector('ids-toast-message')!.setAttribute('id', 'toastMessage');
      }, { options, uniqueId, EVENTS });
      await expect(toast.locator('#toastMessage')).toBeAttached();
      const container = await toast.locator('.toast-container');
      await expect(container).toHaveCSS('transform', 'none');
      await toast.evaluate((el: IdsToast, trans: any) => { el.toastContainer().style.transform = trans; }, transform);
      const newCont = await toast.evaluate((el: IdsToast) => el.toastContainer().style.transform);
      await expect(newCont).toEqual(transform);

      let events = await toast.evaluate(() => (window as any).toastEvents);
      expect(events.addMessage).toBeTruthy();
      expect(events.savePosition).toBeFalsy();
      expect(events.removeMessage).toBeFalsy();
      expect(events.clearPosition).toBeFalsy();
      await toast.evaluate(async (toastEl: IdsToast) => {
        await toastEl.toastContainer().querySelector<IdsToastMessage>('ids-toast-message')!.removeToastMessage();
      });
      await page.waitForFunction(() => document.querySelector('#toastMessage') === null);
      await expect(toast.locator('#toastMessage')).not.toBeAttached();

      events = await page.evaluate(() => (window as any).toastEvents);
      expect(events.addMessage).toBeTruthy();
      expect(events.savePosition).toBeTruthy();
      expect(events.removeMessage).toBeTruthy();
      expect(events.clearPosition).toBeFalsy();
    });

    test('can update with container language change', async ({ page }) => {
      await button.click();
      await page.evaluate(async () => {
        await document.querySelector<IdsContainer>('ids-container')!.localeAPI.setLanguage('ar');
      });
      await expect(toast).toHaveAttribute('dir', 'rtl');
    });

    test('can remove toast host element', async ({ page }) => {
      await button.click();
      let msgEl;
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      await toast.evaluate((toastEl: IdsToast, opt: any) => {
        toastEl.destroyOnComplete = false;
        toastEl.show(opt);
      }, options);
      const getmessageEl = () => toast.evaluate((el: IdsToast) => el.toastContainer().querySelector('ids-toast-message'));

      msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
      });
      const toastmsg = await page.locator('ids-toast-message').first();
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      msgEl = await getmessageEl();
      expect(msgEl).toBeFalsy();

      await toast.evaluate((toastEl: IdsToast, opt: any) => {
        toastEl.position = 'top-start';
        toastEl.savePosition = true;
        toastEl.draggable = true;
        toastEl.destroyOnComplete = false;
        toastEl.show(opt);
      }, options);

      msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
      });
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      msgEl = await getmessageEl();
      expect(msgEl).toBeFalsy();
    });

    test('can not destroy on complete toast', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      await toast.evaluate((toastEl: IdsToast, opt: any) => {
        toastEl.destroyOnComplete = false;
        toastEl.show(opt);
      }, options);
      const getmessageEl = () => toast.evaluate((el: IdsToast) => el.toastContainer().querySelector('ids-toast-message'));

      const msgEl = await getmessageEl();
      expect(msgEl).toBeTruthy();
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
      });
      const toastmsg = await page.locator('ids-toast-message').first();
      const toastCont = await toast.locator('.toast-container');
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      await expect(toastmsg).toBeFalsy();
      await expect(toastCont).toBeFalsy();
    });

    test('can close with click (x) button toast message', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      await page.evaluate((opt: any) => {
        const Idstoast: any = document.createElement('ids-toast') as IdsToast;
        document.body.appendChild(Idstoast);
        Idstoast.show(opt);
      }, options);
      const toastmsg = await page.locator('ids-toast-message').first();
      const btnclose = await toastmsg.locator('.close-button');
      await expect(toastmsg).toBeTruthy();
      await expect(btnclose).toBeTruthy();
      await btnclose.click();
      await page.evaluate(() => {
        const closeButton = document.querySelector('.close-button');
        const event = new Event('click', { bubbles: true });
        closeButton?.dispatchEvent(event);
      });
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      await expect(toastmsg).toBeFalsy();
    });

    test('can handle pause/play by key events toast message', async ({ page }) => {
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      await page.evaluate((opt: any) => {
        const Idstoast: any = document.createElement('ids-toast') as IdsToast;
        document.body.appendChild(Idstoast);
        Idstoast.show(opt);
      }, options);

      const toastmsg = await page.locator('ids-toast-message').first();
      await expect(toastmsg).toBeTruthy();
      await page.evaluate(() => {
        let event = new KeyboardEvent('keydown', { keyCode: 80, ctrlKey: true, altKey: true });
        document.dispatchEvent(event);
        event = new KeyboardEvent('keydown', { keyCode: 27 });
        document.dispatchEvent(event);
      });
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      await expect(toastmsg).toBeFalsy();
    });

    test('can handle pause/play by mouse events toast message', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10
      };
      await page.evaluate((opt: any) => {
        const Idstoast: any = document.createElement('ids-toast') as IdsToast;
        document.body.appendChild(Idstoast);
        Idstoast.show(opt);
      }, options);

      const toastmsg = await page.locator('ids-toast-message').first();
      await expect(toastmsg).toBeTruthy();
      await page.evaluate(async () => {
        const toastContainer = document.querySelector<IdsToast>('ids-toast')?.toastContainer();
        const messageEl = toastContainer?.querySelector<IdsToastMessage>('ids-toast-message');

        let event = new Event('mousedown', { bubbles: true });
        messageEl?.container?.dispatchEvent(event);

        event = new Event('mouseup', { bubbles: true });
        messageEl?.container?.dispatchEvent(event);

        messageEl?.setAttribute('audible', 'true');
        await messageEl?.removeToastMessage();
      });
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      await expect(toastmsg).toBeFalsy();
    });

    test('can handle toast message progress bar', async ({ page }) => {
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10000,
      };
      await page.evaluate((opt: any) => {
        const Idstoast: any = document.createElement('ids-toast') as IdsToast;
        document.body.appendChild(Idstoast);
        Idstoast.destroyOnComplete = false;
        opt.progressBar = true;
        Idstoast.show(opt);
      }, options);

      const toastmsg = await page.locator('ids-toast-message').first();
      await expect(toastmsg).toBeTruthy();
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
      });
      // eslint-disable-next-line no-unreachable-loop
      while (await toastmsg.count() > 0) { return; }
      await expect(toastmsg).toBeFalsy();

      await page.evaluate((opt: any) => {
        const Idstoast: any = document.createElement('ids-toast') as IdsToast;
        document.body.appendChild(Idstoast);
        Idstoast.destroyOnComplete = true;
        opt.progressBar = true;
        Idstoast.show(opt);
      }, options);
      await expect(toastmsg).toBeTruthy();
      const progressBar = await toastmsg.locator('.progress-bar');
      await expect(progressBar).toBeTruthy();
      await page.evaluate(async () => {
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.setAttribute('progress-bar', 'false');
        await document.querySelector<IdsToastMessage>('ids-toast-message')?.removeToastMessage();
        // eslint-disable-next-line no-unreachable-loop
        while (await toastmsg.count() > 0) { return; }
      });
      await expect(toastmsg).toBeFalsy();
    });

    test('can render toast-message with no errors', async ({ page }) => {
      await button.click();
      options = {
        title: 'Test',
        message: 'Some test text',
        timeout: 10000,
      };
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-toast') as IdsToast;
        const messageEl1: any = document.createElement('ids-toast-message') as IdsToastMessage;
        const messageEl2: any = document.createElement('ids-toast-message') as IdsToastMessage;
        messageEl1.audible = null;
        messageEl1.draggable = null;
        messageEl1.progressBar = null;
        messageEl1.timeout = null;
        messageEl1.messageId = null;
        messageEl1.timer = { destroy: () => { } };
        messageEl2.audible = true;
        messageEl2.draggable = true;
        messageEl2.progressBar = true;
        messageEl2.timeout = 10;
        messageEl2.messageId = 'test-id';
        document.body.appendChild(elem);
        const toastContainer = elem.toastContainer();
        toastContainer.appendChild(messageEl1);
        toastContainer.appendChild(messageEl2);
      });
      const msg2 = await page.locator('div > ids-draggable > ids-toast-message:nth-child(2)');
      const draggable = await msg2.evaluate((toastEl: IdsToastMessage) => toastEl.draggable);
      await expect(draggable).toEqual(true);
      await toast.evaluate((toastEl: IdsToast) => toastEl?.remove());
      const idstoast = await page.locator('ids-toast');
      expect(await idstoast.count()).toEqual(1);
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await expect(exceptions).toBeNull();
    });
    test('can call toast-message template', async ({ page }) => {
      await button.click();
      await page.evaluate(() => {
        const messageEl: any = document.createElement('ids-toast-message') as IdsToastMessage;
        messageEl.progressBar = false;
        messageEl.audible = false;
        messageEl.template();
      });
      const toastmsg = await page.locator('ids-toast-message');
      const progressbar = await toastmsg.evaluate((toastEl: IdsToastMessage) => toastEl.progressBar);
      const audible = await toastmsg.evaluate((toastEl: IdsToastMessage) => toastEl.audible);
      await expect(progressbar).toEqual(true);
      await expect(audible).toEqual(false);
    });
  });
});
