/**
 * @jest-environment jsdom
 */
import { expect, it } from '@jest/globals';
import IdsSummaryForm from '../../src/ids-summary-form/ids-summary-form';

describe('IdsSummaryForm Component', () => {
  let summaryForm;

  beforeEach(async () => {
    const elem = new IdsSummaryForm();
    elem.id = 'test-summary-form';
    elem.text = 'Test Summary Form';
    document.body.appendChild(elem);
    summaryForm = document.querySelector('ids-summary-form');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    summaryForm = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    summaryForm.remove();
    summaryForm = new IdsSummaryForm();
    document.body.appendChild(summaryForm);

    expect(document.querySelectorAll('ids-summary-form').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    const elem = new IdsSummaryForm();
    elem.label = 'test';
    elem.data = 'some random data';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets the label correctly', () => {
    summaryForm.label = '';
    expect(summaryForm.container.querySelector('.label').innerHTML).toBe('');

    summaryForm.label = 'title1';
    expect(summaryForm.container.querySelector('.label').innerHTML).toBe('title1');

    summaryForm.label = 'title2';
    expect(summaryForm.container.querySelector('.label').innerHTML).toBe('title2');
  });

  it('sets the data correctly', () => {
    summaryForm.data = '';
    expect(summaryForm.container.querySelector('.data').innerHTML).toBe('');

    summaryForm.data = 'data1';
    expect(summaryForm.container.querySelector('.data').innerHTML).toBe('data1');

    summaryForm.data = 'data2';
    expect(summaryForm.container.querySelector('.data').innerHTML).toBe('data2');
  });

  it('sets the font-weight correctly', () => {
    summaryForm.fontWeight = '';
    expect(summaryForm.container.querySelector('.data').getAttribute('font-weight')).toBe('');

    summaryForm.fontWeight = 'bold';
    expect(summaryForm.container.querySelector('.data').getAttribute('font-weight')).toBe('bold');

    summaryForm.fontWeight = 'bolder';
    expect(summaryForm.container.querySelector('.data').getAttribute('font-weight')).toBe('bolder');
  });
});
