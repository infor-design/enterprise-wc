/**
 * @jest-environment jsdom
 */
import ResizeObserver from '../helpers/resize-observer-mock';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsHomePage from '../../src/components/ids-home-page/ids-home-page';

describe('IdsHomePage Component', () => {
  const origInnerWidth = window.innerWidth;
  const origInnerHeight = window.innerHeight;
  const DEFAULTS = {
    animated: true,
    cardHeight: 370,
    cardWidth: 360,
    cols: 3,
    gap: 20
  };
  DEFAULTS.gapX = DEFAULTS.gap;
  DEFAULTS.gapY = DEFAULTS.gap;

  const EVENTS = { resized: 'resized' };

  let homePage;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    const elem = new IdsHomePage();
    container.language = 'en';
    container.appendChild(elem);
    document.body.appendChild(container);
    container = document.querySelector('ids-container');
    homePage = container.querySelector('ids-home-page');
  });

  afterEach(async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: origInnerWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: origInnerHeight, writable: true });
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsHomePage();
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

  it('should set custom card height', () => {
    expect(homePage.getAttribute('card-height')).toEqual(null);
    expect(homePage.cardHeight).toEqual(DEFAULTS.cardHeight);
    homePage.cardHeight = '260';
    expect(homePage.getAttribute('card-height')).toEqual('260');
    expect(homePage.cardHeight).toEqual(260);
    homePage.cardHeight = null;
    expect(homePage.getAttribute('card-height')).toEqual(null);
    expect(homePage.cardHeight).toEqual(DEFAULTS.cardHeight);
    homePage.cardHeight = 'test';
    expect(homePage.getAttribute('card-height')).toEqual('test');
    expect(homePage.cardHeight).toEqual(DEFAULTS.cardHeight);
  });

  it('should set custom card width', () => {
    expect(homePage.getAttribute('card-width')).toEqual(null);
    expect(homePage.cardWidth).toEqual(DEFAULTS.cardWidth);
    homePage.cardWidth = '260';
    expect(homePage.getAttribute('card-width')).toEqual('260');
    expect(homePage.cardWidth).toEqual(260);
    homePage.cardWidth = null;
    expect(homePage.getAttribute('card-width')).toEqual(null);
    expect(homePage.cardWidth).toEqual(DEFAULTS.cardWidth);
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

  it('should set card gap for single span', () => {
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.gap).toEqual(null);
    homePage.gap = '50';
    expect(homePage.getAttribute('gap')).toEqual('50');
    expect(homePage.gap).toEqual('50');
    homePage.gap = null;
    expect(homePage.getAttribute('gap')).toEqual(null);
    expect(homePage.gap).toEqual(null);
  });

  it('should set card gap-x for single span', () => {
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
    homePage.gapX = '50';
    expect(homePage.getAttribute('gap-x')).toEqual('50');
    expect(homePage.gapX).toEqual('50');
    homePage.gapX = null;
    expect(homePage.getAttribute('gap-x')).toEqual(null);
    expect(homePage.gapX).toEqual(null);
  });

  it('should set card gap-y for single span', () => {
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
    homePage.container.style.width = '1000px';
    await wait(100);
    homePage.container.style.width = '800px';
    homePage.refresh();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should trigger resized event in RTL', async () => {
    await container.setLanguage('ar');
    await processAnimFrame();
    expect(homePage.getAttribute('dir')).toEqual('rtl');
  });

  it('should append card', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
    const id = 'test-card';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    let template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card" id="${id}" colspan="4" rowspan="2"></ids-card>`;
    let card = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(card);
    await wait(100);
    template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card"></ids-card>`;
    card = template.content.cloneNode(true);
    homePage.appendChild(card);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should append card in RTL', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 1250, writable: true });
    const event = new CustomEvent('languagechange', {
      detail: { language: { name: 'ar' } }
    });
    container.dispatchEvent(event);
    const id = 'test-card';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card" id="${id}" colspan="4" rowspan="2"></ids-card>`;
    const card = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(card);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should adjust column width', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 750, writable: true });
    const id = 'test-card';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card" id="${id}"></ids-card>
      <ids-card slot="card" colspan="4"></ids-card>
      <ids-card slot="card" rowspan="2"></ids-card>
      <ids-card slot="card"></ids-card>`;
    const card = template.content.cloneNode(true);
    homePage.cols = '4';
    homePage.appendChild(card);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });

  it('should adjust extra columns', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 2200, writable: true });
    Object.defineProperty(homePage.container, 'offsetWidth', { configurable: true, value: 2150, writable: true });
    const id = 'test-card';
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(0);
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card" id="${id}"></ids-card>
      <ids-card slot="card" colspan="6"></ids-card>
      <ids-card slot="card" rowspan="2"></ids-card>
      <ids-card slot="card"></ids-card>
      <ids-card slot="card"></ids-card>
      <ids-card slot="card" colspan="5"></ids-card>
      <ids-card slot="card" colspan="3" rowspan="2"></ids-card>
      <ids-card slot="card" colspan="3"></ids-card>`;
    const card = template.content.cloneNode(true);
    homePage.animated = 'false';
    homePage.cols = '6';
    homePage.appendChild(card);
    await wait(100);
    expect(homePage.querySelectorAll(`#${id}`).length).toEqual(1);
  });
});
