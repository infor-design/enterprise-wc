/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsTreeMap from '../../src/components/ids-treemap/ids-treemap';
import '../helpers/resize-observer-mock';

describe('IdsTreemap Component initialization', () => {
  let container: IdsContainer;

  const setupComponent = (component: any) => {
    component.title = 'Storage Utilization (78 GB)';
  };

  const checkProperties = (component: any) => {
    expect(component.title).toEqual('Storage Utilization (78 GB)');
  };

  beforeEach(() => {
    container = new IdsContainer();
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('can render via document.createElement (append early)', () => {
    const component: any = document.createElement('ids-treemap');
    container.appendChild(component);
    setupComponent(component);
    checkProperties(component);
  });

  test('can render via document.createElement (append late)', () => {
    const component: any = document.createElement('ids-treemap');
    setupComponent(component);
    container.appendChild(component);
    checkProperties(component);
  });

  test('can render html template', () => {
    container.insertAdjacentHTML('beforeend', `<ids-treemap title="Storage Utilization (78 GB)"></ids-treemap>`);
    const component = document.querySelector('ids-treemap');
    checkProperties(component);
  });
});

describe('IdsTreeMap Component', () => {
  let treemap: IdsTreeMap;
  let origInnerWidth: number;

  beforeEach(() => {
    treemap = new IdsTreeMap();
    document.body.appendChild(treemap);
    treemap.data = treemap.treeMap({
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
      height: 300
    });
    origInnerWidth = treemap.container?.offsetWidth as number;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: origInnerWidth,
      writable: true
    });
    document.body.innerHTML = '';
  });

  test('can set the treemap title', () => {
    expect(treemap.title).toBe('');
    expect(treemap.getAttribute('title')).toBe(null);

    treemap.title = 'Storage Utilization (78 GB)';
    expect(treemap.title).toBe('Storage Utilization (78 GB)');
    expect(treemap.getAttribute('title')).toBe('Storage Utilization (78 GB)');

    treemap.removeAttribute('title');
    expect(treemap.title).toBe('');
    expect(treemap.getAttribute('title')).toBe(null);
  });

  test('can set the treemap height', () => {
    treemap.height = 300;
    expect(treemap.height).toBe(300);
  });

  test('can set the treemap width', async () => {
    treemap.title = 'Storage Utilization (78 GB)';
    treemap.width = treemap.container?.offsetWidth as number;
    expect(treemap.width).toBe(treemap.container?.offsetWidth);
  });
});
