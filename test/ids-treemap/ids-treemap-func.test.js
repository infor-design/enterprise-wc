/**
 * @jest-environment jsdom
 */
import IdsTreeMap from '../../src/components/ids-treemap/ids-treemap';

describe('IdsTreeMap Component', () => {
  let treemap;
  let origInnerWidth;

  beforeEach(async () => {
    const elem = new IdsTreeMap();
    document.body.appendChild(elem);
    treemap = document.querySelector('ids-treemap');
    treemap.result = treemap.treeMap({
      data: [
        {
          value: 28,
          color: '#003876',
          text: 'JSON',
          label: '28%'
        },
        {
          value: 18,
          color: '#004A99',
          text: 'PDF',
          label: '18%'
        },
      ],
      width: 1000,
      height: 300
    });
    origInnerWidth = treemap.container.offsetWidth;
  });

  afterEach(async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: origInnerWidth,
      writable: true
    });
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTreeMap();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-treemap').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    treemap.title = 'Storage Utilization (78 GB)';
    expect(treemap.outerHTML).toMatchSnapshot();
    expect(treemap.result).toBeDefined();
  });

  it('can set the treemap title', () => {
    expect(treemap.title).toBe(null);
    expect(treemap.getAttribute('title')).toBe(null);

    treemap.title = 'Storage Utilization (78 GB)';
    expect(treemap.title).toBe('Storage Utilization (78 GB)');
    expect(treemap.getAttribute('title')).toBe('Storage Utilization (78 GB)');

    treemap.title = null;
    treemap.removeAttribute('title');
    expect(treemap.title).toBe(null);
    expect(treemap.getAttribute('title')).toBe(null);
  });

  it('can set the treemap height', () => {
    treemap.height = 300;
    expect(treemap.height).toBe(300);
  });

  it('can set the treemap width', async () => {
    treemap.title = 'Storage Utilization (78 GB)';
    treemap.width = treemap.container.offsetWidth;
    expect(treemap.width).toBe(treemap.container.offsetWidth);
  });
});
