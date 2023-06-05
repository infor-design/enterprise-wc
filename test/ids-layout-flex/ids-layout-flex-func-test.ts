/**
 * @jest-environment jsdom
 */
import IdsLayoutFlex from '../../src/components/ids-layout-flex/ids-layout-flex';
import IdsLayoutFlexItem from '../../src/components/ids-layout-flex/ids-layout-flex-item';

describe('IdsLayoutFlex Component', () => {
  let flexEl: any;
  let flexItemEl: any;

  beforeEach(async () => {
    const flex: any = new IdsLayoutFlex();
    const item1: any = new IdsLayoutFlexItem();
    const item2: any = new IdsLayoutFlexItem();
    const item3: any = new IdsLayoutFlexItem();

    document.body.appendChild(flex);

    flex.appendChild(item1);
    flex.appendChild(item2);
    flex.appendChild(item3);

    flexEl = document.querySelector('ids-layout-flex');
    flexItemEl = document.querySelector('ids-layout-flex-item');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem: any = new IdsLayoutFlex();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsLayoutFlexItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-layout-flex').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should sets align-content', () => {
    expect(flexEl.alignContent).toEqual(null);
    expect(flexEl.getAttribute('align-content')).toEqual(null);
    flexEl.alignContent = 'center';
    expect(flexEl.alignContent).toEqual('center');
    expect(flexEl.getAttribute('align-content')).toEqual('center');
    flexEl.alignContent = 'test';
    expect(flexEl.getAttribute('align-content')).toEqual(null);
  });

  it('should sets align-items', () => {
    expect(flexEl.alignItems).toEqual(null);
    expect(flexEl.getAttribute('align-items')).toEqual(null);
    flexEl.alignItems = 'center';
    expect(flexEl.alignItems).toEqual('center');
    expect(flexEl.getAttribute('align-items')).toEqual('center');
    flexEl.alignItems = 'test';
    expect(flexEl.getAttribute('align-items')).toEqual(null);
  });

  it('should sets direction', () => {
    expect(flexEl.direction).toEqual(null);
    expect(flexEl.getAttribute('direction')).toEqual(null);
    flexEl.direction = 'column';
    expect(flexEl.direction).toEqual('column');
    expect(flexEl.getAttribute('direction')).toEqual('column');
    flexEl.direction = 'test';
    expect(flexEl.getAttribute('direction')).toEqual(null);
  });

  it('should sets display', () => {
    expect(flexEl.display).toEqual(null);
    expect(flexEl.getAttribute('display')).toEqual(null);
    flexEl.display = 'inline-flex';
    expect(flexEl.display).toEqual('inline-flex');
    expect(flexEl.getAttribute('display')).toEqual('inline-flex');
    flexEl.display = 'test';
    expect(flexEl.getAttribute('display')).toEqual(null);
  });

  it('should sets gap', () => {
    expect(flexEl.gap).toEqual(null);
    expect(flexEl.getAttribute('gap')).toEqual(null);
    flexEl.gap = '8';
    expect(flexEl.gap).toEqual('8');
    expect(flexEl.getAttribute('gap')).toEqual('8');
    flexEl.gap = 'test';
    expect(flexEl.getAttribute('gap')).toEqual(null);
  });

  it('should sets gap-x', () => {
    expect(flexEl.gapX).toEqual(null);
    expect(flexEl.getAttribute('gap-x')).toEqual(null);
    flexEl.gapX = '8';
    expect(flexEl.gapX).toEqual('8');
    expect(flexEl.getAttribute('gap-x')).toEqual('8');
    flexEl.gapX = 'test';
    expect(flexEl.getAttribute('gap-x')).toEqual(null);
  });

  it('should sets gap-y', () => {
    expect(flexEl.gapY).toEqual(null);
    expect(flexEl.getAttribute('gap-y')).toEqual(null);
    flexEl.gapY = '8';
    expect(flexEl.gapY).toEqual('8');
    expect(flexEl.getAttribute('gap-y')).toEqual('8');
    flexEl.gapY = 'test';
    expect(flexEl.getAttribute('gap-y')).toEqual(null);
  });

  it('should sets justify-content', () => {
    expect(flexEl.justifyContent).toEqual(null);
    expect(flexEl.getAttribute('justify-content')).toEqual(null);
    flexEl.justifyContent = 'center';
    expect(flexEl.justifyContent).toEqual('center');
    expect(flexEl.getAttribute('justify-content')).toEqual('center');
    flexEl.justifyContent = 'test';
    expect(flexEl.getAttribute('justify-content')).toEqual(null);
  });

  it('should sets wrap', () => {
    expect(flexEl.wrap).toEqual(null);
    expect(flexEl.getAttribute('wrap')).toEqual(null);
    flexEl.wrap = 'wrap';
    expect(flexEl.wrap).toEqual('wrap');
    expect(flexEl.getAttribute('wrap')).toEqual('wrap');
    flexEl.wrap = 'test';
    expect(flexEl.getAttribute('wrap')).toEqual(null);
  });

  it('should set full height', () => {
    expect(flexEl.fullHeight).toEqual(false);
    expect(flexEl.getAttribute('full-height')).toEqual(null);
    flexEl.fullHeight = '';
    expect(flexEl.fullHeight).toEqual(true);
    expect(flexEl.getAttribute('full-height')).toEqual('');
  });

  it('should set overflow on flex item', () => {
    expect(flexItemEl.overflow).toEqual(null);
    flexItemEl.overflow = 'hidden';
    expect(flexItemEl.overflow).toEqual('hidden');
    flexItemEl.overflow = 'test';
    expect(flexItemEl.overflow).toEqual(null);
  });

  it('should sets align-self with item', () => {
    expect(flexItemEl.alignSelf).toEqual(null);
    expect(flexItemEl.getAttribute('align-self')).toEqual(null);
    flexItemEl.alignSelf = 'center';
    expect(flexItemEl.alignSelf).toEqual('center');
    expect(flexItemEl.getAttribute('align-self')).toEqual('center');
    flexItemEl.alignSelf = 'test';
    expect(flexItemEl.getAttribute('align-self')).toEqual(null);
  });

  it('should sets grow with item', () => {
    expect(flexItemEl.grow).toEqual(null);
    expect(flexItemEl.getAttribute('grow')).toEqual(null);
    flexItemEl.grow = '1';
    expect(flexItemEl.grow).toEqual('1');
    expect(flexItemEl.getAttribute('grow')).toEqual('1');
    flexItemEl.grow = 'test';
    expect(flexItemEl.getAttribute('grow')).toEqual(null);
  });

  it('should sets shrink with item', () => {
    expect(flexItemEl.shrink).toEqual(null);
    expect(flexItemEl.getAttribute('shrink')).toEqual(null);
    flexItemEl.shrink = '1';
    expect(flexItemEl.shrink).toEqual('1');
    expect(flexItemEl.getAttribute('shrink')).toEqual('1');
    flexItemEl.shrink = 'test';
    expect(flexItemEl.getAttribute('shrink')).toEqual(null);
  });
});
