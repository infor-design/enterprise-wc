/**
 * @jest-environment jsdom
 */
import IdsDataLabel from '../../src/components/ids-data-label/ids-data-label';
import IdsContainer from '../../src/components/ids-container/ids-container';
import waitFor from '../helpers/wait-for';
import processAnimFrame from '../helpers/process-anim-frame';

describe('IdsDataLabel Component', () => {
  let dataLabel;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    const elem = new IdsDataLabel();
    elem.innerHTML = `Los Angeles, California 90001 USA`;
    elem.label = 'Address';
    container.appendChild(elem);
    document.body.appendChild(container);
    await container.setLanguage('en');
    dataLabel = document.querySelector('ids-data-label');
    container = document.querySelector('ids-container');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsDataLabel();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-data-label').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(dataLabel.outerHTML).toMatchSnapshot();
  });

  it('renders with label-position', async () => {
    expect(dataLabel.container.classList).toContain('top-positioned');

    dataLabel.labelPosition = 'left';
    await waitFor(() => expect(dataLabel.container.classList[0]).toEqual('left-positioned'));
    expect(dataLabel.labelClass).toEqual('left-positioned');

    dataLabel.labelPosition = 'top';
    await waitFor(() => expect(dataLabel.container.classList[0]).toEqual('top-positioned'));
    expect(dataLabel.labelClass).toEqual('top-positioned');

    dataLabel.labelPosition = '';
    await waitFor(() => expect(dataLabel.container.classList[0]).toEqual('top-positioned'));
    expect(dataLabel.labelClass).toEqual('top-positioned');
  });

  it('can set the label', () => {
    expect(dataLabel.label).toEqual('Address');
    dataLabel.label = 'test';
    expect(dataLabel.label).toEqual('test');
    expect(dataLabel.container.querySelector('.label').innerHTML).toEqual('test<span class="colon"></span>');
    dataLabel.label = '';
    expect(dataLabel.label).toEqual('test');
  });

  it('renders for french', async () => {
    await container.setLanguage('fr');
    dataLabel.label = 'Shipping To';
    dataLabel.labelPosition = 'left';
    await processAnimFrame();
    const colonElements = dataLabel.container.querySelector('.label').getElementsByClassName('colon');
    expect(colonElements.length).toEqual(1);
    expect(dataLabel.getAttribute('language')).toEqual('fr');
  });
});
