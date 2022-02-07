/**
 * @jest-environment jsdom
 */
import IdsDataLabel from '../../src/components/ids-data-label/ids-data-label';
import waitFor from '../helpers/wait-for';

describe('IdsDataLabel Component', () => {
  let dataLabel;

  beforeEach(async () => {
    const elem = new IdsDataLabel();
    elem.innerHTML = `Los Angeles, California 90001 USA`;
    document.body.appendChild(elem);
    dataLabel = document.querySelector('ids-data-label');
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

  it('renders with label-position', () => {
    expect(dataLabel.container.classList).toContain('top-positioned');

    dataLabel.labelPosition = 'left';
    waitFor(() => expect(dataLabel.container.classList[0]).toEqual('left-positioned'));

    dataLabel.labelPosition = 'top';
    waitFor(() => expect(dataLabel.container.classList[0]).toEqual('top-positioned'));
  });

  it('renders for french', () => {
    dataLabel.label = 'Shipping To';
    dataLabel.labelPosition = 'left';
    waitFor(() => {
      const colonElements = dataLabel.container.querySelector('.label').getElementsByClassName('colon');
      expect(colonElements.length).toEqual(1);
      expect(colonElements[0].style.paddingLeft).toEqual('');
    });

    dataLabel.language = 'fr';
    waitFor(() => {
      const colonElements = dataLabel.container.querySelector('.label').getElementsByClassName('colon');
      expect(colonElements.length).toEqual(1);
      expect(colonElements[0].style.paddingLeft).toEqual('8px');
    });
  });
});
