/**
 * @jest-environment jsdom
 */
import IdsSwapList from '../../src/components/ids-swaplist/ids-swaplist';
import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';
import IdsSwappableItem from '../../src/components/ids-swappable/ids-swappable-item';
import dataset from '../../demos/data/periods.json';

const HTMLSnippets = {
  SWAPLIST_COMPONENT: (
    `<ids-swaplist id="swaplist-1" count="3"></ids-swaplist>`
  ),
};

describe('IdsSwapList Component', () => {
  let idsSwapList;
  let idsSwappable;

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

    idsSwappable = new IdsSwappable();
    dataset.forEach((d) => {
      idsSwappable.innerHTML += `
        <ids-swappable-item>
          <ids-text>${d.city}</ids-text>
        </ids-swappable-item>
      `;
    });
    document.body.appendChild(idsSwappable);
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

  it('can swap item to next/previous list on click event', async () => {
    const listItem = idsSwappable.querySelector('ids-swappable-item');
    const event = new MouseEvent('click', {
      target: listItem,
      bubbles: true,
      cancelable: true,
      view: window
    });
    listItem.offEvent('click', listItem);
    listItem.dispatchEvent(event);

    const leftArrowBtn = idsSwapList.shadowRoot.querySelector('.left-arrow');
    const event2 = new MouseEvent('click', {
      target: leftArrowBtn,
      bubbles: true,
      cancelable: true,
      view: window
    });
    leftArrowBtn.offEvent('click', leftArrowBtn);
    leftArrowBtn.dispatchEvent(event2);

    const rightArrowBtn = idsSwapList.shadowRoot.querySelector('.right-arrow');
    const event3 = new MouseEvent('click', {
      target: rightArrowBtn,
      bubbles: true,
      cancelable: true,
      view: window
    });
    rightArrowBtn.offEvent('click', rightArrowBtn);
    rightArrowBtn.dispatchEvent(event3);

    const currentCard1 = leftArrowBtn.parentElement.parentElement.parentElement;
    const currentList1 = currentCard1.nextSibling.querySelector('ids-swappable');
    const currentCard2 = rightArrowBtn.parentElement.parentElement.parentElement;
    const currentList2 = currentCard2.nextSibling.querySelector('ids-swappable');

    setTimeout(() => {
      expect(listItem.selected).toBe('selected');
      expect(idsSwappable.length).toBe(1);
      expect(currentList1.length).toBe(1);
      expect(currentList2.length).toBe(1);
    }, 20);
  });

  it('can swap item to next/previous list on touch event', async () => {
    const listItem = idsSwappable.querySelector('ids-swappable-item');
    const event = new TouchEvent('touchend', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: listItem
      }],
      bubbles: true,
      cancpanelable: true,
      view: window
    });
    listItem.offEvent('touchend', listItem);
    listItem.dispatchEvent(event);

    const leftArrowBtn = idsSwapList.shadowRoot.querySelector('.left-arrow');
    const event2 = new TouchEvent('touchend', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: leftArrowBtn,
      }],
      bubbles: true,
      cancpanelable: true,
      view: window
    });
    leftArrowBtn.offEvent('touchend', leftArrowBtn);
    leftArrowBtn.dispatchEvent(event2);

    const rightArrowBtn = idsSwapList.shadowRoot.querySelector('.right-arrow');
    const event3 = new TouchEvent('touchend', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: rightArrowBtn,
      }],
      bubbles: true,
      cancpanelable: true,
      view: window
    });
    rightArrowBtn.offEvent('touchend', rightArrowBtn);
    rightArrowBtn.dispatchEvent(event3);

    setTimeout(() => {
      expect(listItem.selected).toBe('selected');
      expect(idsSwappable.length).toBe(1);
    }, 20);
  });
});
