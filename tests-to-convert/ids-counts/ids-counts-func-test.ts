/**
 * @jest-environment jsdom
 */
import IdsCounts from '../../src/components/ids-counts/ids-counts';
import IdsText from '../../src/components/ids-text/ids-text';

const template = `
<ids-counts href="#">
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>`;

const compact = `
<ids-counts compact="true" href="#">
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>`;

describe('IdsCounts Component', () => {
  let count: IdsCounts;

  beforeEach(async () => {
    count = new IdsCounts();
    const countValue = new IdsText();
    const countText = new IdsText();
    countValue.setAttribute('count-value', '');
    countText.setAttribute('count-text', '');
    countValue.innerText = '7';
    countText.innerHTML = 'Active <br /> Opportunities';
    count.appendChild(countValue);
    count.appendChild(countText);
    document.body.appendChild(count);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders a specific hex color', () => {
    count.color = '#800000';
    expect(count.getAttribute('color')).toEqual('#800000');
    expect(count.color).toEqual('#800000');
  });

  test('renders a status color', () => {
    count.color = 'base';
    expect(count.getAttribute('color')).toEqual('base');
    expect(count.color).toEqual('base');
  });

  test('unsets container color when href property is set', () => {
    count.href = '#';
    count.color = 'success';
    expect(count.container?.getAttribute('color')).toEqual('');

    count.href = '#';
    count.color = 'error';
    expect(count.container?.getAttribute('color')).toEqual('');
  });

  test('is able to change sizes via compact attribute', () => {
    count.compact = 'true';
    expect(count.getAttribute('compact')).toEqual('true');
    expect(count.compact).toBeTruthy();
  });

  test('is able to change link via href attribute', () => {
    count.href = 'http://www.google.com';
    expect(count.getAttribute('href')).toEqual('http://www.google.com');
    expect(count.href).toEqual('http://www.google.com');
  });

  test('creates an ids-hyperlink container', () => {
    count.remove();
    document.body.insertAdjacentHTML('beforeend', template);
    count = document.querySelector('ids-counts') as IdsCounts;
    expect(count.shadowRoot?.querySelectorAll('ids-hyperlink').length).toEqual(1);
  });

  test('creates a compact counts component', () => {
    count.remove();
    document.body.insertAdjacentHTML('beforeend', compact);
    count = document.querySelector('ids-counts') as IdsCounts;
    expect(count.querySelector<IdsText>('[count-value]')?.fontSize).toEqual('40');
  });
});
