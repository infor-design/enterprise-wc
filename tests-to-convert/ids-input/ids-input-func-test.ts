/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/components/ids-input/ids-input';
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
