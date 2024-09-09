import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsForm from '../../src/components/ids-form/ids-form';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsTextarea from '../../src/components/ids-textarea/ids-textarea';

test.describe('IdsForm tests', () => {
  const url = '/ids-form/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Form Component');
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

  test.describe('functionality tests', () => {
    let idsForm: Locator;

    /**
     * Checks if all components under the form have or doesn't have the attribute
     * @param {string} attribute attribute name
     * @param {string|undefined} value value of the attribute - if not provided - assumes the attribute is not visible
     */
    async function checkFormComponents(attribute: string, value?: string): Promise<void> {
      const hasAttribute = value !== undefined && value !== null;
      expect(await idsForm.evaluate((element: IdsForm, parms) => {
        const elements = element.formComponents;
        const newElements = elements.filter((elem) => {
          if (parms.hasAttribute) {
            let val = elem.getAttribute(parms.attribute);
            if (val === '') val = 'true'; // in compact, there is one element which doesnt have value
            return val !== null && val === parms.value;
          }
          return elem.getAttribute(parms.attribute) === null;
        });
        return elements.length === newElements.length;
      }, { attribute, hasAttribute, value })).toBeTruthy();
    }

    test.beforeEach(async ({ page }) => {
      idsForm = await page.locator('#sample-form');
    });

    test('can set/get compact attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: null, expected: false },
        { data: 'true', expected: true },
        { data: '', expected: true },
      ];

      await checkFormComponents('compact');
      expect(await idsForm.evaluate((element: IdsForm) => element.compact)).toBeFalsy();

      for (const data of testData) {
        expect(await idsForm.evaluate((element: IdsForm, tData) => {
          element.compact = tData as any;
          return element.compact;
        }, data.data)).toEqual(data.expected);
        await checkFormComponents('compact', (data.expected) ? 'true' : undefined);
        if (data.expected) {
          await expect(idsForm).toHaveAttribute('compact', '');
        } else {
          await expect(idsForm).not.toHaveAttribute('compact');
        }
      }
    });

    test.skip('can set/get fieldHeight attribute', async ({ page }) => {
      const testData = [
        {
          data: 'xs', expected: 'xs', attrExpected: 'xs', childrenExpected: 'xs'
        },
        {
          data: 'large', expected: 'md', attrExpected: null, childrenExpected: 'large'
        },
        {
          data: '', expected: 'md', attrExpected: null, childrenExpected: null
        }
      ];

      await checkFormComponents('field-height');
      expect(await idsForm.evaluate((element: IdsForm) => element.fieldHeight)).toEqual('md');

      for (const data of testData) {
        // a refresh is needed in this case since changing the fieldHeight values from valid to invalid doesn't
        // remove all of the values for the children
        await page.reload();
        expect(await idsForm.evaluate((element: IdsForm, tData) => {
          element.fieldHeight = tData as any;
          return element.fieldHeight;
        }, data.data)).toEqual(data.expected);
        await checkFormComponents('field-height', (data.childrenExpected) ? data.childrenExpected : undefined);
        if (data.attrExpected !== null) {
          await expect(idsForm).toHaveAttribute('field-height', data.attrExpected);
        } else {
          await expect(idsForm).not.toHaveAttribute('field-height');
        }
      }
    });

    test('can set/get submitButton attribute', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => element.submitButton)).toEqual('btn-submit');
      await expect(idsForm).toHaveAttribute('submit-button', 'btn-submit');

      expect(await idsForm.evaluate((element: IdsForm) => {
        element.submitButton = 'btn-cancel';
        return element.submitButton;
      })).toEqual('btn-cancel');
      await expect(idsForm).toHaveAttribute('submit-button', 'btn-cancel');

      expect(await idsForm.evaluate((element: IdsForm) => {
        element.submitButton = (null) as any;
        return element.submitButton;
      })).toBeFalsy();
      await expect(idsForm).not.toHaveAttribute('submit-button');
    });

    test('can get all components', async () => {
      const components = await idsForm.evaluate((element: IdsForm) => {
        const res = {
          idsComponents: element.idsComponents,
          formComponents: element.formComponents
        };
        return res;
      });

      expect(components.idsComponents.length).toBeGreaterThan(0);
      expect(components.formComponents.length).toBeGreaterThan(0);
    });

    test('can check and reset dirty tracker', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => element.isDirty)).toBeFalsy();

      await idsForm.getByLabel('Purchase Form').fill('and another 1');
      await idsForm.getByLabel('Notes').fill('testing area');
      await idsForm.click({ force: true });
      expect(await idsForm.evaluate((element: IdsForm) => {
        const res = {
          purchaseFormDirty: (element.querySelector('#purchase-form') as IdsInput).isDirty,
          notes: (element.querySelector('#notes') as IdsTextarea).isDirty,
          isFormDirty: element.isDirty
        };
        return res;
      })).toEqual({ purchaseFormDirty: true, notes: true, isFormDirty: true });

      expect(await idsForm.evaluate((element: IdsForm) => {
        element.resetDirtyTracker();
        const res = {
          purchaseFormDirty: (element.querySelector('#purchase-form') as IdsInput).isDirty,
          notes: (element.querySelector('#notes') as IdsTextarea).isDirty,
          isFormDirty: element.isDirty
        };
        return res;
      })).toEqual({ purchaseFormDirty: false, notes: false, isFormDirty: false });
    });

    test('can check for isValid', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => element.isValid)).toBeTruthy();

      await idsForm.getByLabel('Purchase Form').fill('');
      await idsForm.getByLabel('Notes').fill('');
      await idsForm.click({ force: true });
      expect(await idsForm.evaluate((element: IdsForm) => {
        const res = {
          purchaseFormDirty: (element.querySelector('#purchase-form') as IdsInput).isValid,
          notes: (element.querySelector('#notes') as IdsTextarea).isValid,
          isFormDirty: element.isValid
        };
        return res;
      })).toEqual({ purchaseFormDirty: false, notes: false, isFormDirty: false });
    });

    test('can check validation on all fields', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => element.isValid)).toBeTruthy();
      expect(await idsForm.evaluate((element: IdsForm) => {
        element.checkValidation();
        return element.isValid;
      })).toBeFalsy();
    });

    test('can trigger submit event', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => {
        let isSubmitted = false;
        element.addEventListener('submit', () => { isSubmitted = true; });
        element.querySelector('#btn-submit')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return isSubmitted;
      })).toBeTruthy();
    });

    test('can get form errors', async () => {
      expect(await idsForm.evaluate((element: IdsForm) => element.errorFormComponents.length)).toEqual(0);

      await idsForm.getByLabel('Purchase Form').fill('');
      await idsForm.getByLabel('Notes').fill('');
      await idsForm.click({ force: true });

      expect(await idsForm.evaluate((element: IdsForm) => element.errorFormComponents.length)).toBeGreaterThan(0);
    });
  });
});
