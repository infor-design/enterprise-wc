/**
 * @jest-environment jsdom
 */
import IdsSwapList from '../../src/components/ids-swaplist/ids-swaplist';
import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import dataset from '../../demos/data/periods.json';

const HTMLSnippets = {
  SWAPLIST_COMPONENT: (
    `<ids-swaplist id="swaplist-1" count="3"></ids-swaplist>`
  ),
};

describe('IdsSwapList Component', () => {
  let idsSwapList;
  let listView;

  const createElemViaTemplate = async (innerHTML) => {
    idsSwapList?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwapList = template.content.childNodes[0];

    document.body.appendChild(idsSwapList);

    return idsSwapList;
  };

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());

    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text font-size="16" type="h2">${city}</ids-text><ids-text font-size="12" type="span">${location}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = dataset;
  });

  afterEach(async () => {
    idsSwapList?.remove();
  });

  it('renders with no errors', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    idsSwapList.remove();

    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    idsSwapList.template();
    expect(idsSwapList.outerHTML).toMatchSnapshot();
  });

  it('can set the count', async () => {
    expect(idsSwapList.count).toBe(3);
    expect(idsSwapList.getAttribute('count')).toBe('3');

    idsSwapList.count = 2;
    expect(idsSwapList.count).toBe(2);
    expect(idsSwapList.getAttribute('count')).toBe('2');
  });

  it('can swap item to next/previous list', async () => {
    const listItem = listView.shadowRoot.querySelector('div[part="list-item"]');
    const event = new MouseEvent('click', {
      target: listItem,
      bubbles: true,
      cancelable: true,
      view: window
    });
    listItem.dispatchEvent(event);

    const leftArrowBtn = idsSwapList.shadowRoot.querySelector('.left-arrow');
    const event2 = new MouseEvent('click', {
      target: leftArrowBtn,
      bubbles: true,
      cancelable: true,
      view: window
    });
    leftArrowBtn.dispatchEvent(event2);

    const rightArrowBtn = idsSwapList.shadowRoot.querySelector('.right-arrow');
    const event3 = new MouseEvent('click', {
      target: rightArrowBtn,
      bubbles: true,
      cancelable: true,
      view: window
    });
    rightArrowBtn.dispatchEvent(event3);

    setTimeout(() => {
      expect(listItem.selected).toBe('selected');
      expect(listView.length).toBe(1);
    }, 20);
  });
});
