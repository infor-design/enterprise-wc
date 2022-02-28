/**
 * @jest-environment jsdom
 */
import IdsCheckboxGroup from '../../src/components/ids-checkbox-group/ids-checkbox-group';
import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsCheckboxGroup Component', () => {
  let checkboxGroup;

  beforeEach(async () => {
    const elem = new IdsCheckboxGroup();
    document.body.appendChild(elem);
    checkboxGroup = document.querySelector('ids-checkbox-group');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsCheckboxGroup();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-checkbox-group').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(checkboxGroup.outerHTML).toMatchSnapshot();
    checkboxGroup.label = 'Label Test';
    expect(checkboxGroup.outerHTML).toMatchSnapshot();
    checkboxGroup.innerHTML = `<ids-checkbox label="Option 1" checked="false"></ids-checkbox>`;
    expect(checkboxGroup.outerHTML).toMatchSnapshot();
  });

  it('renders label correctly', () => {
    checkboxGroup.label = 'Label Test';
    expect(checkboxGroup.container.querySelector('ids-text').innerHTML).toEqual('Label Test');
  });

  it('renders checkboxes correctly', () => {
    checkboxGroup.innerHTML = `
      <ids-checkbox label="Option 1" checked="false"></ids-checkbox>
      <ids-checkbox label="Option 2" checked="true"></ids-checkbox>
    `;
    expect(checkboxGroup.querySelectorAll('ids-checkbox').length).toEqual(2);
  });
});
