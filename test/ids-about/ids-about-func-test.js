/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsAbout from '../../src/components/ids-about';

// Supporing components
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

// locale messages
import { messages as esMessages } from '../../src/components/ids-locale/cultures/es-messages';
import { messages as jaMessages } from '../../src/components/ids-locale/cultures/ja-messages';

const name = 'ids-about';
const id = 'test-about-component';
const productVersion = '4.0.0';
const productName = 'Controls';
const copyrightYear = '2022';
const deviceSpecs = true;
const useDefaultCopyright = true;

describe('IdsAbout Component (using properties)', () => {
  let component;

  beforeEach(async () => {
    component = new IdsAbout();
    component.id = id;
    component.productVersion = productVersion;
    component.productName = productName;
    component.copyrightYear = copyrightYear;
    component.deviceSpecs = deviceSpecs;
    component.useDefaultCopyright = useDefaultCopyright;

    document.body.appendChild(component);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(component.outerHTML).toMatchSnapshot();
    component.show();
    expect(component.outerHTML).toMatchSnapshot();

    component.hide();
    expect(component.outerHTML).toMatchSnapshot();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.productVersion).toEqual(productVersion);
    expect(component.productName).toEqual(productName);
    expect(component.copyrightYear).toEqual(copyrightYear);
    expect(component.deviceSpecs).toEqual(deviceSpecs);
    expect(component.useDefaultCopyright).toEqual(useDefaultCopyright);
  });

  it('can alter productVersion and productName', () => {
    const newProductVersion = 'New productVersion';
    const newProductName = 'New productVersion';
    component.productVersion = newProductVersion;
    component.productName = newProductName;

    expect(component.productVersion).toEqual(newProductVersion);
    expect(component.productName).toEqual(newProductName);

    component.productVersion = '';
    component.productName = '';

    expect(component.productVersion).toEqual('');
    expect(component.productName).toEqual('');
  });

  it('can alter useDefaultCopyright', () => {
    component.useDefaultCopyright = false;

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = undefined;

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = 'false';

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = 'true';

    expect(component.useDefaultCopyright).toBeTruthy();
  });

  it('can alter deviceSpecs', () => {
    component.deviceSpecs = false;

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = undefined;

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = 'false';

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = 'true';

    expect(component.deviceSpecs).toBeTruthy();
  });

  it('can alter copyrightYear', () => {
    component.copyrightYear = 2015;

    expect(component.copyrightYear).toEqual('2015');
  });
});

describe('IdsAbout Component (using attributes)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-about id="about-example" product-name="Controls" product-version="4.0.0">
      <ids-icon slot="icon" icon="logo" size="large" /></ids-icon>
      <ids-text id="about-example-name" slot="appName" type="h1" font-size="24">IDS Enterprise</ids-text>
      <ids-text id="about-example-content" slot="content" type="p">Fashionable components for fashionable applications.</ids-text>
    </ids-about>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.productName).toEqual(productName);
    expect(component.productVersion).toEqual(productVersion);
    expect(component.copyrightYear).toEqual(new Date().getFullYear());
    expect(component.useDefaultCopyright).toBeTruthy();
    expect(component.deviceSpecs).toBeTruthy();
  });

  it('should not close on click outside', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    component.visible = true;
    setTimeout(() => {
      // Click outside the about into the overlay area
      document.body.dispatchEvent(clickEvent);
      // Nor should calling the method directly
      component.onOutsideClick();

      setTimeout(() => {
        expect(component.visible).toEqual(true);
        done();
      });
    }, 70);
  });
});

describe('IdsAbout Component (empty)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-about id="${id}"></ids-about>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have default properties', () => {
    expect(component.copyrightYear).toEqual(new Date().getFullYear());
    expect(component.deviceSpecs).toBeTruthy();
    expect(component.useDefaultCopyright).toBeTruthy();
  });

  it('can change productVersion and productName after being invoked', () => {
    const newProductVersion = '1.0.1';
    const newProductName = 'IdsAbout';

    component.productVersion = newProductVersion;
    component.productName = newProductName;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.productName).toEqual(newProductName);
    expect(component.productVersion).toEqual(newProductVersion);
  });

  it('can change copyrightYear after being invoked', () => {
    component.copyrightYear = 2015;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.copyrightYear).toEqual('2015');
  });

  it('can remove default copyright after being invoked', () => {
    component.useDefaultCopyright = false;

    expect(component.useDefaultCopyright).toBeFalsy();
  });

  it('can remove device specs after being invoked', () => {
    component.deviceSpecs = false;

    expect(component.deviceSpecs).toBeFalsy();
  });

  it('can click outside and it wont close', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    component.visible = true;
    setTimeout(() => {
      document.body.dispatchEvent(clickEvent);
      component.onOutsideClick();

      setTimeout(() => {
        expect(component.visible).toEqual(true);
        done();
      });
    }, 70);
  });
});

describe('IdsAbout Component locale', () => {
  let component;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    component = new IdsAbout();
    container.appendChild(component);
    document.body.appendChild(container);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
    container = null;
  });

  it('can change language self', async () => {
    await component.setLanguage('ar');
    expect(component.getAttribute('dir')).toEqual('rtl');

    await component.setLanguage('es');

    // if copyright translates
    let copyrightOriginal = esMessages.AboutText.value
      .replace('&copy; {0}', `© ${new Date().getFullYear()}`)
      .concat(' www.infor.com.');
    let copyrightReceived = document.querySelector('[slot="copyright"]').textContent;

    expect(copyrightOriginal).toEqual(copyrightReceived);

    // if device specs translates
    let deviceSpecsText = document.querySelector('[slot="device"]').textContent;

    expect(deviceSpecsText).toContain(esMessages.Platform.value);

    await component.setLanguage('ja');

    // if copyright translates
    copyrightOriginal = jaMessages.AboutText.value
      .replace('&copy; {0}', `© ${new Date().getFullYear()}`)
      .concat(' www.infor.com.');
    copyrightReceived = document.querySelector('[slot="copyright"]').textContent;

    expect(copyrightOriginal).toEqual(copyrightReceived);

    // if device specs translates
    deviceSpecsText = document.querySelector('[slot="device"]').textContent;

    expect(deviceSpecsText).toContain(jaMessages.Platform.value);
  });

  it('can change language from the container', async () => {
    await container.setLanguage('ar');
    expect(component.getAttribute('dir')).toEqual('rtl');

    await container.setLanguage('es');

    // if copyright translates
    let copyrightOriginal = esMessages.AboutText.value
      .replace('&copy; {0}', `© ${new Date().getFullYear()}`)
      .concat(' www.infor.com.');
    let copyrightReceived = document.querySelector('[slot="copyright"]').textContent;

    expect(copyrightOriginal).toEqual(copyrightReceived);

    // if device specs translates
    let deviceSpecsText = document.querySelector('[slot="device"]').textContent;

    expect(deviceSpecsText).toContain(esMessages.Platform.value);

    await container.setLanguage('ja');

    // if copyright translates
    copyrightOriginal = jaMessages.AboutText.value
      .replace('&copy; {0}', `© ${new Date().getFullYear()}`)
      .concat(' www.infor.com.');
    copyrightReceived = document.querySelector('[slot="copyright"]').textContent;

    expect(copyrightOriginal).toEqual(copyrightReceived);

    // if device specs translates
    deviceSpecsText = document.querySelector('[slot="device"]').textContent;

    expect(deviceSpecsText).toContain(jaMessages.Platform.value);
  });
});
