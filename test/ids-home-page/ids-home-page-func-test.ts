/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsHomePage from '../../src/components/ids-home-page/ids-home-page';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsHomePage Component', () => {
  const origInnerWidth = window.innerWidth;
  const origInnerHeight = window.innerHeight;
  const DEFAULTS = {
    animated: true,
    widgetHeight: 368,
    widgetWidth: 360,
    cols: 3,
    gap: 20,
    gapX: 20,
    gapY: 20
  };

  const EVENTS = { resized: 'resized' };

  let homePage: IdsHomePage;
  let container: IdsContainer;

  beforeEach(async () => {
    container = new IdsContainer();
    const elem = new IdsHomePage();
    container.language = 'en';
    container.appendChild(elem);
    IdsGlobal.getLocale().loadedLanguages.set('ar', arMessages);

    document.body.appendChild(container);
    container = document.querySelector('ids-container') as IdsContainer;
    homePage = container.querySelector('ids-home-page') as IdsHomePage;
  });

  afterEach(async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: origInnerWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: origInnerHeight, writable: true });
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsHomePage();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-home-page').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set animated to home page', () => {
    expect(homePage.getAttribute('animated')).toEqual(null);
    expect(homePage.animated).toEqual(DEFAULTS.animated);
    homePage.animated = true;
    expect(homePage.getAttribute('animated')).toEqual('true');
    expect(homePage.animated).toEqual(true);
    homePage.animated = false;
    expect(homePage.getAttribute('animated')).toEqual('false');
    expect(homePage.animated).toEqual(false);
    homePage.animated = null;
    expect(homePage.getAttribute('animated')).toEqual(null);
    expect(homePage.animated).toEqual(DEFAULTS.animated);
  });

  it('should set custom widget height', () => {
    expect(homePage.getAttribute('widget-height')).toEqual(null);
    expect(homePage.widgetHeight).toEqual(DEFAULTS.widgetHeight);
    homePage.widgetHeight = '260';
    expect(homePage.getAttribute('widget-height')).toEqual('260');
    expect(homePage.widgetHeight).toEqual(260);
    homePage.widgetHeight = null;
    expect(homePage.getAttribute('widget-height')).toEqual(null);
    expect(homePage.widgetHeight).toEqual(DEFAULTS.widgetHeight);
    homePage.widgetHeight = 'test';
    expect(homePage.getAttribute('widget-height')).toEqual('test');
    expect(homePage.widgetHeight).toEqual(DEFAULTS.widgetHeight);
  });

  it('should set custom widget width', () => {
    expect(homePage.getAttribute('widget-width')).toEqual(null);
    expect(homePage.widgetWidth).toEqual(DEFAULTS.widgetWidth);
    homePage.widgetWidth = '260';
    expect(homePage.getAttribute('widget-width')).toEqual('260');
    expect(homePage.widgetWidth).toEqual(260);
    homePage.widgetWidth = null;
    expect(homePage.getAttribute('widget-width')).toEqual(null);
    expect(homePage.widgetWidth).toEqual(DEFAULTS.widgetWidth);
  });

  it('should set max columns', () => {
    expect(homePage.getAttribute('cols')).toEqual(null);
    expect(homePage.cols).toEqual(DEFAULTS.cols);
    homePage.cols = '4';
    expect(homePage.getAttribute('cols')).toEqual('4');
    expect(homePage.cols).toEqual(4);
    homePage.cols = null;
    expect(homePage.getAttribute('cols')).toEqual(null);
    expect(homePage.cols).toEqual(DEFAULTS.cols);
  });

  it('should set widget gap for single span', () => {
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    homePage.gap = '50';
    expect(homePage.getAttribute('gap')).toEqual('50');
    expect(homePage.gap).toEqual('50');
    homePage.gap = null;
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.gap).toEqual(null);
  });

  it('should set widget gap-x for single span', () => {
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
    homePage.gapX = '50';
    expect(homePage.getAttribute('gap-x')).toEqual('50');
    expect(homePage.gapX).toEqual('50');
    homePage.gapX = null;
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
  });

  it('should set widget gap-y for single span', () => {
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gapY).toEqual(null);
    homePage.gapY = '50';
    expect(homePage.getAttribute('gap-y')).toEqual('50');
    expect(homePage.gapY).toEqual('50');
    homePage.gapY = null;
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gapY).toEqual(null);
  });

  it('should set other gap states', () => {
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    expect(homePage.gapX).toEqual(null);
    homePage.gap = '30';
    homePage.gapX = '50';
    expect(homePage.getAttribute('gap')).toEqual('30');
    expect(homePage.getAttribute('gap-x')).toEqual('50');
    expect(homePage.gap).toEqual('30');
    expect(homePage.gapX).toEqual('50');
    homePage.gap = null;
    homePage.gapX = null;
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    expect(homePage.gapX).toEqual(null);

    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    expect(homePage.gapY).toEqual(null);
    homePage.gap = '30';
    homePage.gapY = '50';
    expect(homePage.getAttribute('gap')).toEqual('30');
    expect(homePage.getAttribute('gap-y')).toEqual('50');
    expect(homePage.gap).toEqual('30');
    expect(homePage.gapY).toEqual('50');
    homePage.gap = null;
    homePage.gapY = null;
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    expect(homePage.gapY).toEqual(null);

    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
    expect(homePage.gapY).toEqual(null);
    homePage.gapX = '30';
    homePage.gapY = '50';
    expect(homePage.getAttribute('gap-x')).toEqual('30');
    expect(homePage.getAttribute('gap-y')).toEqual('50');
    expect(homePage.gapX).toEqual('30');
    expect(homePage.gapY).toEqual('50');
    homePage.gapX = null;
    homePage.gapY = null;
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.getAttribute('gap-y')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
    expect(homePage.gapY).toEqual(null);
  });

  it('should trigger resized event', async () => {
    const mockCallback = jest.fn(() => { });
    homePage.addEventListener(EVENTS.resized, mockCallback);
    homePage.container?.style.setProperty('width', '1000px');
    await wait(100);
    homePage.container?.style.setProperty('width', '800px');
    homePage.refresh();
    expect(mockCallback).toHaveBeenCalled();
  });

  it.skip('should trigger resized event in RTL', async () => {
    await container.localeAPI.setLanguage('ar');
    await processAnimFrame();
    expect(homePage.getAttribute('dir')).toEqual('rtl');
  });

  it('should append widget', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
    const id = 'test-widget';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    let template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget" id="${id}" colspan="4" rowspan="2"></ids-widget>`;
    let widget = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(widget);
    await wait(100);
    template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget"></ids-widget>`;
    widget = template.content.cloneNode(true);
    homePage.appendChild(widget);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should append widget in RTL', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
    const event = new CustomEvent('languagechange', {
      detail: { language: { name: 'ar' } }
    });
    container.dispatchEvent(event);
    const id = 'test-widget';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget" id="${id}" colspan="4" rowspan="2"></ids-widget>`;
    const widget = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(widget);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should adjust column width', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 750, writable: true });
    const id = 'test-widget';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget" id="${id}"></ids-widget>
      <ids-widget slot="widget" colspan="4"></ids-widget>
      <ids-widget slot="widget" rowspan="2"></ids-widget>
      <ids-widget slot="widget"></ids-widget>`;
    const widget = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(widget);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should adjust extra columns', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 2200, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 2150, writable: true });
    const id = 'test-widget';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget" id="${id}"></ids-widget>
      <ids-widget slot="widget" colspan="6"></ids-widget>
      <ids-widget slot="widget" rowspan="2"></ids-widget>
      <ids-widget slot="widget"></ids-widget>
      <ids-widget slot="widget"></ids-widget>
      <ids-widget slot="widget" colspan="5"></ids-widget>
      <ids-widget slot="widget" colspan="3" rowspan="2"></ids-widget>
      <ids-widget slot="widget" colspan="3"></ids-widget>`;
    const widget = template.content.cloneNode(true);
    homePage.animated = 'false';
    homePage.cols = '6';
    homePage.appendChild(widget);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });
});
