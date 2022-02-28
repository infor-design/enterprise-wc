/**
 * @jest-environment jsdom
 */
import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';
import IdsSwappableItem from '../../src/components/ids-swappable/ids-swappable-item';

const HTMLSnippets = {
  SWAPPABLE_COMPONENT: (
    `<ids-swappable id="swappable-1" multi-select="true">
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
  let idsSwappable;

  const createElemViaTemplate = async (innerHTML) => {
    idsSwappable?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwappable = template.content.childNodes[0];

    document.body.appendChild(idsSwappable);

    return idsSwappable;
  };

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    idsSwappable = new IdsSwappable();
    document.body.appendChild(idsSwappable);
  });

  afterEach(async () => {
    idsSwappable?.remove();
  });

  it('renders with no errors', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swappable').length).toEqual(1);

    idsSwappable.remove();

    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    expect(document.querySelectorAll('ids-swappable').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    idsSwappable.template();
    expect(idsSwappable.outerHTML).toMatchSnapshot();
  });

  it('can set the multi-select attribute', async () => {
    expect(idsSwappable.multiSelect).toBe(null);
    expect(idsSwappable.getAttribute('multi-select')).toBe(null);

    idsSwappable.multiSelect = true;
    expect(idsSwappable.multiSelect).toEqual('');
    expect(idsSwappable.getAttribute('multi-select')).toBe('');
  });

  it('can select ids-swappable-item', async () => {
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

  it('can toggle select on ids-swappable-items', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];
    const event = new MouseEvent('click', {
      target: startingItem,
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

  it('can get drag and drop items', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    const items = idsSwappable.querySelectorAll('ids-swappable-item');
    const startingItem = items[0];
    const endingItem = items[2];

    const createBubbledEvent = (type, props = {}) => {
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

  it('can use keyboard events to navigate items', async () => {
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
