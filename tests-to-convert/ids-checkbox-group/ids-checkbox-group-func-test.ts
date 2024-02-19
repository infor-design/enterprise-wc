/**
 * @jest-environment jsdom
 */
import IdsCheckboxGroup from '../../src/components/ids-checkbox-group/ids-checkbox-group';
import '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsCheckboxGroup Component', () => {
  let checkboxGroup: any;

  beforeEach(async () => {
    const elem: any = new IdsCheckboxGroup();
    document.body.appendChild(elem);
    checkboxGroup = document.querySelector('ids-checkbox-group');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders label correctly', () => {
    checkboxGroup.label = 'Label Test';
    expect(checkboxGroup.container.querySelector('ids-text').innerHTML).toEqual('Label Test');

    checkboxGroup.label = null;
    expect(checkboxGroup.container.querySelector('ids-text').innerHTML).toEqual('');
  });

  test('renders checkboxes correctly', () => {
    checkboxGroup.innerHTML = `
      <ids-checkbox label="Option 1" checked="false"></ids-checkbox>
      <ids-checkbox label="Option 2" checked="true"></ids-checkbox>
    `;
    expect(checkboxGroup.querySelectorAll('ids-checkbox').length).toEqual(2);
  });
});
