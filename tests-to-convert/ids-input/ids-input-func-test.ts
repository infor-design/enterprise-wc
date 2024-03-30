/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/components/ids-input/ids-input';
import { LABEL_WRAPS } from '../../src/components/ids-input/ids-input-attributes';
import IdsDataSource from '../../src/core/ids-data-source';
import dataset from '../../src/assets/data/states.json';
import '../helpers/resize-observer-mock';

test('should autoselect', (done) => {
  input.autoselect = true;
  input.value = 'test';
  expect(input.getAttribute('autoselect')).toEqual('true');
  input.input.focus();
  input.shadowRoot.querySelector('.ids-input-field').focus();
  setTimeout(() => {
    input.autoselect = false;
    input.handleInputFocusEvent('remove');
    expect(input.getAttribute('autoselect')).toEqual(null);
    done();
  }, 2);
});

test('should set label wrap', () => {
  const attrName = 'label-wrap';
  const defaultVal = 'wrap';
  const check = (applyVal: string, propVal: string | null, attrVal: string | null) => {
    input.labelWrap = applyVal;
    expect(input.labelWrap).toEqual(propVal);
    expect(input.getAttribute(attrName)).toEqual(attrVal);
  };

  expect(input.labelWrap).toEqual(defaultVal);
  expect(input.getAttribute(attrName)).toEqual(null);
  LABEL_WRAPS.forEach((val) => check(val, val, val));
  check('test', defaultVal, null);
});

test('should not set wrong size', () => {
  input.size = 'test';
  expect(input.getAttribute('size')).toEqual('md');
  expect(input.container.classList).not.toContain('test');
  const size = 'sm';
  input.size = size;
  expect(input.getAttribute('size')).toEqual(size);
  expect(input.container.classList).toContain(size);
});

test('should render input sizes', () => {
  const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
  const checkSize = (size: any) => {
    input.size = size;
    expect(input.getAttribute('size')).toEqual(size);
    expect(input.container.classList).toContain(size);
    sizes.filter((s) => s !== size).forEach((s) => {
      expect(input.container.classList).not.toContain(s);
    });
  };
  expect(input.getAttribute('size')).toEqual(null);
  expect(input.container.classList).toContain('md');
  sizes.forEach((s) => checkSize(s));
});

test('should not set wrong input field height', () => {
  const className = (h: any) => `field-height-${h}`;
  input.fieldHeight = 'test';
  expect(input.getAttribute('field-height')).toEqual(null);
  expect(input.container.classList).not.toContain('test');
  expect(input.container.classList).not.toContain(className('test'));
  const fieldHeight = 'sm';
  input.fieldHeight = fieldHeight;
  expect(input.getAttribute('field-height')).toEqual(fieldHeight);
  expect(input.container.classList).toContain(className(fieldHeight));
});

test('should render input field height', () => {
  const heights = ['xs', 'sm', 'md', 'lg'];
  const defaultHeight = 'md';
  const className = (h: any) => `field-height-${h}`;
  const checkHeight = (height: any) => {
    input.fieldHeight = height;
    expect(input.getAttribute('field-height')).toEqual(height);
    expect(input.container.classList).toContain(className(height));
    heights.filter((h) => h !== height).forEach((h) => {
      expect(input.container.classList).not.toContain(className(h));
    });
  };
  expect(input.getAttribute('field-height')).toEqual(null);
  heights.filter((h) => h !== defaultHeight).forEach((h) => {
    expect(input.container.classList).not.toContain(className(h));
  });
  expect(input.container.classList).toContain(className(defaultHeight));
  heights.forEach((h) => checkHeight(h));
});

test('cannot have both a "compact" and "field-height" setting applied', () => {
  input.compact = true;

  expect(input.hasAttribute('compact')).toBeTruthy();
  expect(input.container.classList.contains('compact')).toBeTruthy();

  input.fieldHeight = 'xs';

  expect(input.hasAttribute('compact')).toBeFalsy();
  expect(input.container.classList.contains('compact')).toBeFalsy();
  expect(input.getAttribute('field-height')).toEqual('xs');
  expect(input.container.classList.contains('field-height-xs')).toBeTruthy();

  input.compact = true;

  expect(input.hasAttribute('compact')).toBeTruthy();
  expect(input.container.classList.contains('compact')).toBeTruthy();
  expect(input.hasAttribute('field-height')).toBeFalsy();
  expect(input.container.classList.contains('field-height-xs')).toBeFalsy();
});

test('supports setting cursor', () => {
  input.cursor = 'pointer';
  expect(input.shadowRoot.querySelector('input').style.cursor).toEqual('pointer');
  expect(input.cursor).toEqual('pointer');
});

test('supports setting noMargins', () => {
  input.noMargins = true;
  expect(input.noMargins).toEqual(true);
  expect(input.container.classList.contains('no-margins')).toEqual(true);
  expect(input.hasAttribute('no-margins')).toBeTruthy();

  input.noMargins = false;
  expect(input.noMargins).toEqual(false);
  expect(input.hasAttribute('no-margins')).toBeFalsy();
});

test('supports setting padding', () => {
  input.padding = '10';
  expect(input.padding).toEqual('10');
  expect(input.input.style.getPropertyValue('padding-inline-end')).toEqual('10px');

  input.padding = '';
  expect(input.padding).toEqual('');
  expect(input.input.style.getPropertyValue('padding-inline-end')).toEqual('');
});

test('focuses its inner HTMLInputElement when the host element becomes focused', () => {
  input.focus();
  expect(document.activeElement).toEqual(input);
});

test('focuses its inner HTMLInputElement when its label is clicked', async () => {
  const labelEl = input.container.querySelector('label');
  labelEl.click();

  expect(input.input.isEqualNode(input.shadowRoot.activeElement));
});

test('should set autocomplete', async () => {
  const template = document.createElement('template');
  template.innerHTML = '<ids-input label="testing input" autocomplete></ids-input>';
  input = template.content.childNodes[0];
  document.body.appendChild(input);

  expect(input.autocomplete).toEqual(true);
  input.autocomplete = null;
  expect(input.autocomplete).toEqual(false);

  input.data = [];
  expect(input.data.length).toEqual(0);

  input.datasource = new IdsDataSource();
  input.data = dataset;
  expect(input.data.length).toEqual(59);

  expect(input.searchField).toEqual('value');
  input.searchField = 'label';
  expect(input.searchField).toEqual('label');
});

test('should set readonly background', async () => {
  const template = document.createElement('template');
  template.innerHTML = '<ids-input label="testing input" readonly-background="true"></ids-input>';
  input = template.content.childNodes[0];
  document.body.appendChild(input);

  expect(input.container.classList).toContain('readonly-background');
  input.readonlyBackground = false;
  expect(input.container.classList).not.toContain('readonly-background');
});

test('should set active', async () => {
  const template = document.createElement('template');
  template.innerHTML = '<ids-input label="testing input" active="true"></ids-input>';
  input = template.content.childNodes[0];
  document.body.appendChild(input);

  expect(input.container.classList).toContain('is-active');
  input.active = false;
  expect(input.container.classList).not.toContain('is-active');
});

test('should open popup on keydown if autocomplete is enabled', async () => {
  const template = document.createElement('template');
  template.innerHTML = '<ids-input label="testing input" autocomplete value="a"></ids-input>';
  input = template.content.childNodes[0];
  document.body.appendChild(input);

  input.datasource = new IdsDataSource();
  input.data = dataset;

  const keydownendEvent = new KeyboardEvent('keydownend', { key: 'a' });
  input.dispatchEvent(keydownendEvent);
  input.value = 'a';
  input.popup.open = true;
  input.popup.visible = true;
  expect(input.popup.open).toBe(true);

  const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  const navigateUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });

  input.dispatchEvent(navigateDownEvent);
  input.dispatchEvent(navigateUpEvent);

  input.options[0].classList.add('is-selected');
  expect(input.options[0].classList).toContain('is-selected');

  input.dispatchEvent(navigateDownEvent);
  input.dispatchEvent(navigateUpEvent);

  const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

  input.dispatchEvent(enterEvent);
  input.popup.open = false;
  input.popup.visible = false;
  expect(input.popup.open).toBe(false);

  const template2 = document.createElement('template');
  template2.innerHTML = '<ids-input label="testing input" autocomplete readonly disabled value=""></ids-input>';
  input = template2.content.childNodes[0];
  document.body.appendChild(input);

  const keydownendEvent2 = new KeyboardEvent('keydownend', { key: 'a' });
  input.dispatchEvent(keydownendEvent2);
  input.popup.open = false;
  input.popup.visible = false;
  expect(input.popup.open).toBe(false);
});
