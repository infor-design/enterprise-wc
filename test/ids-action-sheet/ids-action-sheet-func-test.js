/**
 * @jest-environment jsdom
 */
import IdsActionSheet from '../../src/components/ids-action-sheet';

describe('IdsActionSheet Component', () => {
  let el;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    const elem = new IdsActionSheet();
    document.body.appendChild(elem);
    el = document.querySelector('ids-action-sheet');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
    window.requestAnimationFrame.mockRestore();
  });

  it('renders correctly', () => {
    expect(el.outerHTML).toMatchSnapshot();
  });
});
