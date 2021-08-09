/**
 * @jest-environment jsdom
 */
import IdsSummaryField from '../../src/ids-summary-field/ids-summary-field';

describe('IdsSummaryField Component', () => {
  let summaryField;

  beforeEach(async () => {
    const elem = new IdsSummaryField();
    elem.id = 'test-summary-field';
    elem.text = 'Test Summary Field';
    document.body.appendChild(elem);
    summaryField = document.querySelector('ids-summary-field');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    summaryField= null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    summaryField.remove();
    summaryField= new IdsSummaryField();
    document.body.appendChild(summaryField);

    expect(document.querySelectorAll('ids-summary-field').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    const elem = new IdsSummaryField();
    elem.label = 'test';
    elem.data = 'some random data';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets the label correctly', () => {
    summaryField.label = '';
    expect(summaryField.container.querySelector('.label').innerHTML).toBe('');

    summaryField.label = 'title1';
    expect(summaryField.container.querySelector('.label').innerHTML).toBe('title1');

    summaryField.label = 'title2';
    expect(summaryField.container.querySelector('.label').innerHTML).toBe('title2');
  });

  it('sets the data correctly', () => {
    summaryField.data = '';
    expect(summaryField.container.querySelector('.data').innerHTML).toBe('');

    summaryField.data = 'data1';
    expect(summaryField.container.querySelector('.data').innerHTML).toBe('data1');

    summaryField.data = 'data2';
    expect(summaryField.container.querySelector('.data').innerHTML).toBe('data2');
  });
});
