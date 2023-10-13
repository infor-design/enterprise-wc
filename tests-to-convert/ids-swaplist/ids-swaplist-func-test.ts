/**
 * @jest-environment jsdom
 */
import IdsSwapList from '../../src/components/ids-swaplist/ids-swaplist';
import '../../src/components/ids-swappable/ids-swappable-item';
import '../../src/components/ids-list-view/ids-list-view';
import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';
import dataset from '../../src/assets/data/swaplist-data.json';

const HTMLSnippets = {
  SWAPLIST_COMPONENT: (
    `<ids-swaplist id="swaplist-1"></ids-swaplist>`
  ),
};

describe('IdsSwapList Component', () => {
  let idsSwapList: any;
  let idsSwappable: any;

  const createElemViaTemplate = async (innerHTML: any) => {
    idsSwapList?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwapList = template.content.childNodes[0];

    document.body.appendChild(idsSwapList);

    return idsSwapList;
  };

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => cb());

    idsSwappable = new IdsSwappable();
    idsSwapList = new IdsSwapList();
    idsSwapList.innerHTML = '<ids-text>${city}</ids-text>'; //eslint-disable-line

    document.body.appendChild(idsSwapList);
    idsSwapList.data = dataset;
  });

  afterEach(async () => {
    idsSwapList?.remove();
  });

  it('renders with no errors', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);
    idsSwapList.innerHTML = '<template><ids-text>${city}</ids-text></template>'; //eslint-disable-line
    idsSwapList.data = dataset;

    idsSwapList.remove();

    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    idsSwapList.template();
    idsSwapList.data = dataset;
    expect(idsSwapList.outerHTML).toMatchSnapshot();
  });

  it('can swap item to next/previous list on click event', async () => {
    const event0 = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsSwapList.offEvent('click', idsSwapList);
    idsSwapList.container.dispatchEvent(event0);

    const listItem = idsSwapList.container.querySelector('ids-swappable-item');
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    listItem.offEvent('click', listItem);
    listItem.dispatchEvent(event);

    const leftArrowBtn = idsSwapList.shadowRoot.querySelector('.left-arrow');
    const event2 = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    leftArrowBtn.offEvent('click', leftArrowBtn);
    leftArrowBtn.dispatchEvent(event2);

    const rightArrowBtn = idsSwapList.shadowRoot.querySelector('.right-arrow');
    const event3 = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    rightArrowBtn.offEvent('click', rightArrowBtn);
    rightArrowBtn.dispatchEvent(event3);

    const currentCard1 = leftArrowBtn.parentElement.parentElement.parentElement;
    const currentList1 = currentCard1.querySelector('ids-swappable');
    const currentCard2 = rightArrowBtn.parentElement.parentElement.parentElement;
    const currentList2 = currentCard2.querySelector('ids-swappable');

    setTimeout(() => {
      expect(listItem.selected).toBe('selected');
      expect(idsSwappable.length).toBe(1);
      expect(currentList1.length).toBe(1);
      expect(currentList2.length).toBe(1);
    }, 20);
  });

  it('can swap item to next/previous list on touch event', async () => {
    const event0 = new TouchEvent('touchend', {
      touches: [{
        identifier: 123,
        target: idsSwapList.container,
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        force: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    idsSwapList.container.dispatchEvent(event0);

    const listItem = idsSwapList.container.querySelector('ids-swappable-item');
    const event = new TouchEvent('touchend', {
      touches: [{
        identifier: 123,
        pageX: 0,
        pageY: 0,
        target: listItem,
        clientX: 0,
        clientY: 0,
        force: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    listItem.offEvent('touchend', listItem);
    listItem.dispatchEvent(event);

    const leftArrowBtn = idsSwapList.shadowRoot.querySelector('.left-arrow');
    const event2 = new TouchEvent('touchend', {
      touches: [{
        identifier: 123,
        pageX: 0,
        pageY: 0,
        target: leftArrowBtn,
        clientX: 0,
        clientY: 0,
        force: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });
    leftArrowBtn.offEvent('touchend', leftArrowBtn);
    leftArrowBtn.dispatchEvent(event2);

    const rightArrowBtn = idsSwapList.shadowRoot.querySelector('.right-arrow');
    const event3 = new TouchEvent('touchend', {
      touches: [{
        identifier: 123,
        pageX: 0,
        pageY: 0,
        target: rightArrowBtn,
        clientX: 0,
        clientY: 0,
        force: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }],
      bubbles: true,
      cancelable: true,
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
