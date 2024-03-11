/**
 * @jest-environment jsdom
 */
import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';
import '../../src/components/ids-swappable/ids-swappable-item';

const HTMLSnippets = {
  SWAPPABLE_COMPONENT: (
    `<ids-swappable id="swappable-1" selection="multiple">
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
    </ids-swappable>`
  ),
  SWAPPABLE_COMPONENT_2: (
    `<ids-swappable id="swappable-2">
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
    </ids-swappable>`
  ),
};

describe('IdsSwappable Component', () => {
  let idsSwappable: any;

  const createElemViaTemplate = async (innerHTML: any) => {
    idsSwappable?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwappable = template.content.childNodes[0];

    document.body.appendChild(idsSwappable);

    return idsSwappable;
  };

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
    idsSwappable = new IdsSwappable();
    document.body.appendChild(idsSwappable);
  });

  afterEach(async () => {
    idsSwappable?.remove();
  });

  test('can select ids-swappable-item', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];

    expect(startingItem.selected).toBe(false);
    expect(startingItem.originalText).toBe(null);

    startingItem.selected = true;
    startingItem.originalText = 'Test Text';

    expect(startingItem.selected).toBe(true);
    expect(startingItem.originalText).toBe('Test Text');
    expect(idsSwappable.querySelectorAll('[selected]').length).toBe(1);

    startingItem.selected = '';
    startingItem.removeAttribute('selected');
    expect(startingItem.selected).toBe(false);

    const idsSwappable2 = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT_2);
    const items2 = idsSwappable2.querySelectorAll('ids-swappable-item');
    const startingItem2 = items2[0];

    expect(startingItem2.selected).toBe(false);
    expect(startingItem2.originalText).toBe(null);
    expect(idsSwappable.querySelectorAll('[selected]').length).toBe(0);

    startingItem2.selected = true;
    startingItem2.originalText = 'Test Text';

    expect(startingItem2.selected).toBe(true);
    expect(startingItem2.originalText).toBe('Test Text');

    startingItem2.selected = '';
    startingItem2.removeAttribute('selected');
    expect(startingItem2.selected).toBe(false);
  });

  test('can toggle select on ids-swappable-items', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    startingItem.offEvent('click', startingItem);
    startingItem.dispatchEvent(event);
    startingItem.click();

    startingItem.selected = true;
    expect(startingItem.selected).toEqual(true);
    expect(startingItem.getAttribute('selected')).toEqual('');

    startingItem.dispatchEvent(event);
    startingItem.click();

    startingItem.selected = false;
    startingItem.removeAttribute('selected');
    expect(startingItem.selected).toEqual(false);
    expect(startingItem.getAttribute('selected')).toEqual(null);
  });

  test('can get drag and drop items', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];
    const endingItem = items[2];

    const createBubbledEvent = (type: any, props = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, props);
      return event;
    };

    idsSwappable.dispatchEvent(
      createBubbledEvent('dragstart', {})
    );

    startingItem.dispatchEvent(
      createBubbledEvent('dragstart', { selected: true })
    );

    endingItem.dispatchEvent(
      createBubbledEvent('dragend', {})
    );

    startingItem.dispatchEvent(
      createBubbledEvent('drag', { selected: true })
    );

    idsSwappable.dispatchEvent(
      createBubbledEvent('dragover', {})
    );

    endingItem.dispatchEvent(
      createBubbledEvent('dragover', {})
    );

    idsSwappable.dispatchEvent(
      createBubbledEvent('drop', {})
    );

    endingItem.dispatchEvent(
      createBubbledEvent('drop', {})
    );

    idsSwappable.dispatchEvent(
      createBubbledEvent('dragleave', {})
    );

    startingItem.dispatchEvent(
      createBubbledEvent('dragleave', {})
    );

    endingItem.dispatchEvent(
      createBubbledEvent('dragend', {})
    );
  });

  test('can use keyboard events to navigate items', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const event2 = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const event3 = new KeyboardEvent('keydown', { key: 'Enter' });

    startingItem.dispatchEvent(event);
    startingItem.dispatchEvent(event2);
    startingItem.dispatchEvent(event3);
  });
});
