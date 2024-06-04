import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsUploadAdvanced from '../../src/components/ids-upload-advanced/ids-upload-advanced';
import IdsUploadAdvancedShared from '../../src/components/ids-upload-advanced/ids-upload-advanced-shared';
import IdsUploadAdvancedFile from '../../src/components/ids-upload-advanced/ids-upload-advanced-file';

test.describe('IdsUploadAdvanced tests', () => {
  const url = '/ids-upload-advanced/example.html';
  let uploadAdvance : any;
  let uploadAdvancedFile : any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    uploadAdvance = await page.locator('#elem-upload-advanced-basic');
    uploadAdvancedFile = await page.locator('ids-upload-advanced-file').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Upload Advanced Component');
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
        .disableRules(['color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-upload-advanced');
      const html = await handle?.evaluate((el: IdsUploadAdvanced) => el?.outerHTML);
      await expect(html).toMatchSnapshot('upload-advanced-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-upload-advanced');
      const html = await handle?.evaluate((el: IdsUploadAdvanced) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('upload-advanced-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-upload-advanced-light');
    });
  });

  test.describe('reattachment tests', () => {
    test('should not have errors after reattaching', async ({ page }) => {
      const elemId = '#elem-upload-advanced-basic';
      page.on('pageerror', (err) => {
        expect(err).toBeNull();
      });

      await page.evaluate((arg) => {
        const elem = document.querySelector(arg)!;
        const parentNode = elem.parentNode!;

        parentNode.removeChild(elem);
        parentNode.appendChild(elem);
      }, elemId);
    });

    test('should not duplicate upload status banners after reattaching', async ({ page }) => {
      const elemId = '#elem-upload-advanced-basic';
      const filePath = 'src/assets/images/10.jpg';
      const uploadAdvanced = await page.locator(elemId);
      await page.locator('#elem-upload-advanced-basic .file-input').setInputFiles(filePath);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.files.length)).toEqual(1);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.container?.querySelectorAll('ids-upload-advanced-file').length)).toEqual(1);

      await page.evaluate((arg) => {
        const elem = document.querySelector(arg)!;
        const parentNode = elem.parentNode!;

        parentNode.removeChild(elem);
        parentNode.appendChild(elem);
      }, elemId);

      await page.locator('#elem-upload-advanced-basic .file-input').setInputFiles(filePath);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.files.length)).toEqual(1);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.container?.querySelectorAll('ids-upload-advanced-file').length)).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    test('can format bytes from shared file', async () => {
      expect((IdsUploadAdvancedShared as any).formatBytes()).toEqual('');
      expect(IdsUploadAdvancedShared.formatBytes(1048576)).toEqual('1.05 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1048576, 2)).toEqual('1.05 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1048576, 3)).toEqual('1.049 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1048576, 4)).toEqual('1.0486 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1048576, 0)).toEqual('1 MB');

      expect(IdsUploadAdvancedShared.formatBytes(1548576)).toEqual('1.55 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1548576, 2)).toEqual('1.55 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1548576, 3)).toEqual('1.549 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1548576, 4)).toEqual('1.5486 MB');
      expect(IdsUploadAdvancedShared.formatBytes(1548576, 0)).toEqual('2 MB');
    });

    test('renders as limit types accept', async () => {
      const fileinput = await uploadAdvance.locator('input').first();
      const files = [
        { size: 5000, type: 'audio/mp3', name: 'myfile1.mp3' },
        { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await expect(uploadAdvance).not.toHaveAttribute('accept');
      await expect(fileinput).not.toHaveAttribute('accept');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.accept = '.jpg'; });
      await expect(uploadAdvance).toHaveAttribute('accept', '.jpg');
      await expect(fileinput).toHaveAttribute('accept', '.jpg');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.accept = null; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).not.toHaveAttribute('accept');
      await expect(fileinput).not.toHaveAttribute('accept');
    });

    test('can render as disabled', async () => {
      const rootEL = await uploadAdvance.locator('.ids-upload-advanced');
      await expect(uploadAdvance).not.toHaveAttribute('disabled');
      await expect(rootEL).not.toHaveClass(/disabled/);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.disabled = true; });
      await expect(uploadAdvance).toHaveAttribute('disabled', 'true');
      await expect(rootEL).toHaveClass(/disabled/);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.disabled = false; });
      await expect(uploadAdvance).not.toHaveAttribute('disabled');
      await expect(rootEL).not.toHaveClass(/disabled/);
    });

    test('can set icon to be use in main drop area', async () => {
      const defaultIcon = 'upload';
      const icon = await uploadAdvance.locator('.icon').first();
      await expect(uploadAdvance).not.toHaveAttribute('icon');
      await expect(icon).toHaveAttribute('icon', defaultIcon);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.icon = 'delete'; });
      await expect(uploadAdvance).toHaveAttribute('icon', 'delete');
      await expect(icon).toHaveAttribute('icon', 'delete');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.icon = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('icon');
      await expect(icon).toHaveAttribute('icon', defaultIcon);
    });

    test('can set icon size for main drop area', async () => {
      const icon = await uploadAdvance.locator('.icon').first();
      let iconSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.iconSize);
      await expect(iconSize).toBeNull();
      await expect(uploadAdvance).not.toHaveAttribute('icon-size');
      await expect(icon).not.toHaveAttribute('icon-size');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.iconSize = 'large'; });
      await expect(uploadAdvance).toHaveAttribute('icon-size', 'large');
      await expect(icon).toHaveAttribute('size', 'large');
      iconSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.iconSize);
      await expect(iconSize).toBe('large');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.iconSize = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('icon-size');
      await expect(icon).not.toHaveAttribute('size');
      iconSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.iconSize);
      await expect(iconSize).toBeNull();
    });

    test('can set the max file size', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
        { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
      ];
      await expect(uploadAdvance).not.toHaveAttribute('max-file-size');
      let maxfileSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFileSize);
      await expect(maxfileSize).toEqual(-1);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFileSize = '2000'; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).toHaveAttribute('max-file-size', '2000');
      maxfileSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFileSize);
      await expect(maxfileSize).toEqual('2000');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFileSize = null as any; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).not.toHaveAttribute('max-file-size');
      maxfileSize = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFileSize);
      await expect(maxfileSize).toEqual(-1);
    });

    test('can set max number of files can be uploaded', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await expect(uploadAdvance).not.toHaveAttribute('max-files');
      let maxfile = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFiles);
      await expect(maxfile).toEqual(99999);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFiles = 2; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).toHaveAttribute('max-files', '2');
      maxfile = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFiles);
      await expect(maxfile).toEqual('2');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFiles = null; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).not.toHaveAttribute('max-files');
      maxfile = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFiles);
      await expect(maxfile).toEqual(99999);
    });

    test('can set max number of files can be uploaded while in process', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
        { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
      ];
      await expect(uploadAdvance).not.toHaveAttribute('max-files-in-process');
      let maxFilesInProcess = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFilesInProcess);
      await expect(maxFilesInProcess).toEqual(99999);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFilesInProcess = 2; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).toHaveAttribute('max-files-in-process', '2');
      maxFilesInProcess = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFilesInProcess);
      await expect(maxFilesInProcess).toEqual('2');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.maxFilesInProcess = null; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await expect(uploadAdvance).not.toHaveAttribute('max-files-in-process');
      maxFilesInProcess = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.maxFilesInProcess);
      await expect(maxFilesInProcess).toEqual(99999);
    });

    test('can set method to use xhr', async () => {
      await expect(uploadAdvance).not.toHaveAttribute('method');
      let method = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.method);
      await expect(method).toEqual('POST');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.method = 'PUT'; });
      await expect(uploadAdvance).toHaveAttribute('method', 'PUT');
      method = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.method);
      await expect(method).toEqual('PUT');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.method = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('method');
      method = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.method);
      await expect(method).toEqual('POST');
    });

    test('can set param name to read from server', async () => {
      await expect(uploadAdvance).not.toHaveAttribute('param-name');
      let paramName = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.paramName);
      await expect(paramName).toEqual('myfile');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.paramName = 'test'; });
      await expect(uploadAdvance).toHaveAttribute('param-name', 'test');
      paramName = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.paramName);
      await expect(paramName).toEqual('test');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.paramName = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('param-name');
      paramName = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.paramName);
      await expect(paramName).toEqual('myfile');
    });

    test('can set link to browse files to upload', async () => {
      await expect(uploadAdvance).not.toHaveAttribute('show-browse-link');
      let showBrowseLink = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.showBrowseLink);
      await expect(showBrowseLink).toBeNull();
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.showBrowseLink = 'false'; });
      await expect(uploadAdvance).toHaveAttribute('show-browse-link', 'false');
      showBrowseLink = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.showBrowseLink);
      await expect(showBrowseLink).toEqual('false');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.showBrowseLink = 'true'; });
      await expect(uploadAdvance).toHaveAttribute('show-browse-link', 'true');
      showBrowseLink = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.showBrowseLink);
      await expect(showBrowseLink).toEqual('true');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.showBrowseLink = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('show-browse-link');
      showBrowseLink = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.showBrowseLink);
      await expect(showBrowseLink).toBeNull();
    });

    test('can set url to use with xhr', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await expect(uploadAdvance).toHaveAttribute('url', 'http://localhost:4300/upload');
      let uploadUrl = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.url);
      await expect(uploadUrl).toEqual('http://localhost:4300/upload');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.url = 'http://test.com/somepath'; });
      await expect(uploadAdvance).toHaveAttribute('url', 'http://test.com/somepath');
      uploadUrl = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.url);
      await expect(uploadUrl).toEqual('http://test.com/somepath');
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.url = null as any; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.disabled = false; });
      await expect(uploadAdvance).not.toHaveAttribute('url');
      uploadUrl = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.url);
      await expect(uploadUrl).toBeNull();
    });

    test('can get current files from api', async ({ page }) => {
      const files = [
        { size: 5000, type: 'audio/mp3', name: 'myfile1.mp3' },
        { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
        { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.accept = '.jpg'; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const length = await page.locator('ids-upload-advanced').all();
      await expect(length).toHaveLength(5);
      const upload = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const inProcess = el.inProcess.length;
        const aborted = el.aborted.length;
        const errored = el.errored.length;
        const completed = el.completed.length;
        return {
          inProcess,
          aborted,
          errored,
          completed
        };
      });
      await expect(upload.inProcess).toEqual(0);
      await expect(upload.aborted).toEqual(0);
      await expect(upload.errored).toEqual(3);
      await expect(upload.completed).toEqual(0);
    });

    test('can change event on file input', async ({ page }) => {
      const input = await uploadAdvance.locator('input');
      const files: any = { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' };
      const args: any = { bubbles: true, files: [files] };
      await input.dispatchEvent('change', args);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([file]); }, files);
      const fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(1);
    });

    test('can click event on label', async ({ page }) => {
      const label = await uploadAdvance.locator('label');
      const hyperlink = await uploadAdvance.locator('.hyperlink');
      await page.evaluate((el: any) => {
        (window as any).labelListener = false;
        (window as any).hyperlinkListener = false;
        el.labelHandle.addEventListener('click', () => { (window as any).labelListener = true; });
        el.hyperlinkHandle.addEventListener('click', () => { (window as any).hyperlinkListener = true; });
      }, { labelHandle: await label.elementHandle(), hyperlinkHandle: await hyperlink.elementHandle() });
      await hyperlink.click();
      await expect(await page.evaluate(() => {
        const labelEvent = (window as any).labelListener;
        const hyperlinkEvent = (window as any).hyperlinkListener;
        return {
          labelEvent,
          hyperlinkEvent
        };
      })).toEqual({ labelEvent: true, hyperlinkEvent: true });
    });

    test('can update slot value', async () => {
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        span1.setAttribute('slot', 'text-droparea');
        span2.setAttribute('slot', 'text-droparea-with-browse');
        span3.setAttribute('slot', 'xhr-headers');
        span3.setAttribute('id', 'xhr-headers-id');
        span1.innerHTML = 'text-for-droparea';
        span2.innerHTML = 'Drag and Drop or test-browse-link to Upload';
        span3.innerHTML = '[{ "name": "header1", "value": "header1-value" }]';
        el.appendChild(span1);
        el.appendChild(span2);
        el.appendChild(span3);
        el.setXhrHeaders();
      });
      let xhrHeaders = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.xhrHeaders);
      await expect(xhrHeaders).toEqual([{ name: 'header1', value: 'header1-value' }]);
      await uploadAdvance.evaluate(() => { document.querySelector('#xhr-headers-id')!.innerHTML = 'test'; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.setXhrHeaders(); });
      xhrHeaders = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.xhrHeaders);
      await expect(xhrHeaders).toBeNull();
      await uploadAdvance.evaluate(() => { document.querySelector('#xhr-headers-id')!.innerHTML = '{ "name": "header1", "value": "header1-value" }'; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.setXhrHeaders(); });
      xhrHeaders = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.xhrHeaders);
      await expect(xhrHeaders).toEqual([{ name: 'header1', value: 'header1-value' }]);
    });

    test('can run custom send methods', async ({ page }) => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        el.send = () => {}; // eslint-disable-line
      });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(2);
    });

    test('can call xhr method', async ({ page }) => {
      let files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        el.xhrHeaders = [{ name: 'header1', value: 'header1-value' }];
      });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      let fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(2);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        el.xhrHeaders = [{ name: '', value: '' }];
      });
      fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(2);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const elem = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        elem?.forEach((els: any) => (els.shadowRoot.querySelector('.btn-close').click()));
      });
      files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' },
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(3);
    });

    test('can drag drop', async ({ page }) => {
      const files = [{ size: 1000, type: 'image/jpg', name: 'myfile1.jpg' }];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => {
        const createBubbledEvent = (type: any, attributes = {}) => {
          const event = new Event(type, { bubbles: true });
          Object.assign(event, attributes);
          return event;
        };
        el.disabled = true;
        el.droparea?.dispatchEvent(
          createBubbledEvent('dragenter', { dataTransfer: { file } })
        );
        el.droparea?.dispatchEvent(
          createBubbledEvent('drop', { dataTransfer: { file } })
        );
      }, files);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => {
        const createBubbledEvent = (type: any, attributes = {}) => {
          const event = new Event(type, { bubbles: true });
          Object.assign(event, attributes);
          return event;
        };
        el.disabled = false;
        el?.droparea?.dispatchEvent(
          createBubbledEvent('dragenter', { dataTransfer: { file } })
        );
        el?.droparea?.dispatchEvent(
          createBubbledEvent('dragover', { dataTransfer: { file } })
        );
        el?.droparea?.dispatchEvent(
          createBubbledEvent('drop', { dataTransfer: { file } })
        );
        document.dispatchEvent(
          createBubbledEvent('dragenter', { dataTransfer: { file } })
        );
        document.dispatchEvent(
          createBubbledEvent('dragover', { dataTransfer: { file } })
        );
        document.dispatchEvent(
          createBubbledEvent('drop', { dataTransfer: { file } })
        );
      }, files);
      const fileElems = await page.locator('ids-upload-advanced-file').all();
      await expect(fileElems).toHaveLength(1);
    });

    test('can render template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const el = document.createElement('ids-upload-advanced');
        el.setAttribute('accept', '.jpg');
        el.setAttribute('disabled', 'true');
        el.setAttribute('max-files-in-process', '1');
        document.body.appendChild(el);
      });
      uploadAdvance = await page.locator('ids-upload-advanced');
      const isDisabled = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.disabled);
      await expect(isDisabled).toBe('true');
      const rootEl = await uploadAdvance.locator('.ids-upload-advanced');
      await expect(rootEl).toHaveClass(/disabled/);
    });

    test('can auto start', async () => {
      await expect(uploadAdvance).not.toHaveAttribute('auto-start');
      let autoStart = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.autoStart);
      await expect(autoStart).toEqual(true);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      await expect(uploadAdvance).toHaveAttribute('auto-start', 'false');
      autoStart = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.autoStart);
      await expect(autoStart).toEqual(false);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = true; });
      await expect(uploadAdvance).toHaveAttribute('auto-start', 'true');
      autoStart = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.autoStart);
      await expect(autoStart).toEqual(true);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = null as any; });
      await expect(uploadAdvance).not.toHaveAttribute('auto-start');
      autoStart = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.autoStart);
      await expect(autoStart).toEqual(true);
    });

    test('can set arbitrary error message on file', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      expect(fileNodes.length).toEqual(2);
      let status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.all;
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['errored', 'errored']);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const node = el.all;
        el.setError({ message: 'test', node });
      });
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.all;
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['errored', 'errored']);
    });

    test('can set arbitrary error message on single file by ui element', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      expect(fileNodes.length).toEqual(2);
      let status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['errored', 'errored']);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0];
        el.setError({ message: 'test', node });
      });
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['errored', 'errored']);
    });

    test('can manually start upload single file', async () => {
      // TODO status is errored
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      expect(fileNodes.length).toEqual(2);
      let status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['not-started', 'not-started']);

      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0] as any;
        node.start();
      });
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['in-process', 'not-started']);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[1] as any;
        node?.shadowRoot.querySelector('.btn-start').click();
      });
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['in-process', 'in-process']);
    });

    test('can manually start upload all files', async () => {
      // TODO status is errored
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      let toolbararea = await uploadAdvance.locator('.toolbararea');
      await expect(toolbararea).not.toBeAttached();
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      const fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      const toolbar = await uploadAdvance.locator('ids-toolbar');
      toolbararea = await uploadAdvance.locator('.toolbararea');
      await expect(toolbararea).toBeAttached();

      expect(fileNodes.length).toEqual(2);
      let status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['not-started', 'not-started']);
      const btnStartAll = await toolbar.locator('#btn-start-all');
      await btnStartAll.click();
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['in-process', 'in-process']); // status is errored.
      await toolbararea.dispatchEvent('transitionend');
      toolbararea = await uploadAdvance.locator('.toolbararea');
      await expect(toolbararea).not.toBeAttached();
    });

    test('can cancel upload single file', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      let fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      let allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.all.length);
      await expect(allItems).toBe(2);
      expect(fileNodes.length).toEqual(2);
      let status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['not-started', 'not-started']);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const fileElems = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0] as any;
        fileElems.cancel();
      });
      fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.all.length);
      await expect(allItems).toBe(1);
      expect(fileNodes.length).toEqual(1);
      status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const fileElem = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0] as any;
        return fileElem?.status;
      });
      await expect(status).toEqual('not-started');
    });

    test('can cancel upload all file', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      let fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      let allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.all.length);
      await expect(allItems).toBe(2);
      expect(fileNodes.length).toEqual(2);
      const toolbar = await uploadAdvance.locator('ids-toolbar');
      const status = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const stats: any[] = [];
        const node = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file');
        node?.forEach((fileNode: any) => {
          stats.push(fileNode.status);
        });
        return stats;
      });
      await expect(status).toEqual(['not-started', 'not-started']);
      const btncancelll = await toolbar.locator('#btn-cancel-all');
      await btncancelll.click();
      fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.all.length);
      await expect(allItems).toBe(0);
      expect(fileNodes.length).toEqual(0);
    });

    test('can remove if existing in files', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.autoStart = false; });
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      let fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      let allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.all.length);
      await expect(allItems).toBe(2);
      expect(fileNodes.length).toEqual(2);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const fileElems = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0] as any;
        fileElems.start();
      });

      // await expect(status).toEqual(['in-process', 'not-started']); // status is errored
      fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.files.length);
      await expect(allItems).toBe(2);
      expect(fileNodes.length).toEqual(2);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => { el.files = el.files.slice(1); });
      fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      allItems = await uploadAdvance.evaluate((el: IdsUploadAdvanced) => el.files.length);
      await expect(allItems).toBe(1);
      expect(fileNodes.length).toEqual(2);
      await uploadAdvance.evaluate((el: IdsUploadAdvanced) => {
        const fileElems = el.shadowRoot?.querySelectorAll('ids-upload-advanced-file')[0] as any;
        fileElems.cancel();
      });
      fileNodes = await uploadAdvance.locator('ids-upload-advanced-file').all();
      expect(fileNodes.length).toEqual(2);
    });

    test('can set abort handler', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.abortHandler(); });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('aborted');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.setStatus(); });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('aborted');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.status = 'in-process'; el.value = 10; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate(
        (el: IdsUploadAdvancedFile) => { el.abortHandler({ loaded: 10, total: 100, abort: true }); }
      );
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('aborted');
    });

    test('can set progress handle', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.progressHandler({ loaded: 35, total: 100 }); });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      const value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toEqual('35');
    });

    test('can set status', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'errored');
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.status = 'not-started'; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('not-started');
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'not-started');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.status = null; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'in-process');
    });

    test('can set complete handler', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'in-process');
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        const event = {
          loaded: 100,
          total: 100,
          target: {
            readyState: 4,
            status: 200
          },
        };
        el.completeHandler(event);
      });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('completed');
    });

    test('can set complete handler with error', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'in-process');
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        const event = {
          loaded: 100,
          total: 100,
          target: {
            readyState: 4,
            status: 201
          }
        };
        el.completeHandler(event);
      });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.error = null; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 100; });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        const event = {
          loaded: 100,
          total: 100,
          target: {
            readyState: 4,
            status: 201
          }
        };
        el.completeHandler(event);
      });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
    });

    test('can set error handler', async () => {
      // TODO status is errored instead of in-process
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      await expect(uploadAdvancedFile).toHaveAttribute('status', 'in-process');
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        const event = {
          loaded: 10,
          total: 100,
          target: {
            readyState: 4,
            status: 401,
            statusText: '<em>Error</em>: Some server issue!'
          }
        };
        el.errorHandler(event);
      });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.error = null; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.errorHandler('some-error-text'); });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      const errMsg = await uploadAdvancedFile.locator('.error-msg');
      await expect(errMsg).toHaveText('some-error-text');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.error = null; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.errorHandler(false); });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.error = null; });
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = -5; });
      await expect(errMsg).toHaveText('Failed to upload, server issue');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        const errorMsgEl = el?.shadowRoot?.querySelector('.error-row .error-msg');
        errorMsgEl?.classList.remove('error-msg');
      });
      await expect(errMsg).not.toBeAttached();
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.errorHandler(false); });
    });

    test('can set file name', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      let filename = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.fileName);
      await expect(filename).toEqual('test');
      await expect(uploadAdvancedFile).toHaveAttribute('file-name', 'test');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.fileName = null; });
      filename = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.fileName);
      await expect(filename).toEqual('');
      await expect(uploadAdvancedFile).not.toHaveAttribute('file-name');
    });

    test('can set file size', async () => {
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      let size = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.size);
      await expect(size).toEqual('1000');
      await expect(uploadAdvancedFile).toHaveAttribute('size', '1000');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.size = null; });
      size = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.size);
      await expect(size).toBeNull();
      await expect(uploadAdvancedFile).not.toHaveAttribute('size');
    });

    test('can set progress bar value', async () => {
      // TODO cannot change value
      const files = [
        { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
        { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
      ];
      await uploadAdvance.evaluate((el: IdsUploadAdvanced, file: any) => { el.handleFileUpload([...file]); }, files);
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => {
        el.setAttribute('file-name', 'test');
        el.setAttribute('size', '1000');
      });
      let value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toBe('0');
      await expect(uploadAdvancedFile).toHaveAttribute('value', '0');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 10; });
      value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toEqual('10');
      await expect(uploadAdvancedFile).toHaveAttribute('value', '10');
      let status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 20; });
      value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toEqual('20');
      await expect(uploadAdvancedFile).toHaveAttribute('value', '20');
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('in-process');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.error = 'some-error'; });
      value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toEqual('20');
      await expect(uploadAdvancedFile).toHaveAttribute('value', '20');
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = 30; });
      value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toEqual('20');
      await expect(uploadAdvancedFile).toHaveAttribute('value', '20');
      status = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.status);
      await expect(status).toEqual('errored');
      await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => { el.value = null; });
      value = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.value);
      await expect(value).toBeNull();
      await expect(uploadAdvancedFile).not.toHaveAttribute('value');
    });

    test('can render template of file items', async () => {
      await uploadAdvance.evaluate(() => {
        const el = document.createElement('ids-upload-advanced-file');
        const parentEl = document.querySelector('#elem-upload-advanced-basic') as any;
        el.setAttribute('disabled', 'true');
        parentEl?.container.appendChild(el);
      });
      const isDisabled = await uploadAdvancedFile.evaluate((el: IdsUploadAdvancedFile) => el.disabled);
      await expect(isDisabled).toBe('true');
      const rootEl = await uploadAdvancedFile.locator('.ids-upload-advanced-file');
      await expect(rootEl).toHaveClass(/disabled/);
    });
  });
});
