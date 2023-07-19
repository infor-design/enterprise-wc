/**
 * @jest-environment jsdom
 */
import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import dataset from '../../src/assets/data/products-100.json';
import processAnimFrame from '../helpers/process-anim-frame';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

describe('IdsListViewItem Component', () => {
  let listView: IdsListView;

  beforeEach(async () => {
    listView = new IdsListView();
    listView.innerHTML = dataset
      .map((e: any) => `
        <ids-list-view-item>
          <ids-text font-size="16" type="h2">${e?.productName}</ids-text>
        </ids-list-view-item>
      `)
      .join('');

    document.body.appendChild(listView);
    listView = document.querySelector('ids-list-view') as IdsListView;
    await processAnimFrame();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    await processAnimFrame();
  });

  it('Renders properly', () => {
    expect(dataset?.length > 0).toBe(true);
    expect(dataset[0]?.productName?.length > 0).toBe(true);
    expect(listView?.children?.length).toBe(dataset.length);

    const listViewItems = listView?.querySelectorAll('ids-list-view-item');
    expect(listViewItems?.length).toBe(dataset.length);
  });

  it('Has a default slot', () => {
    const slot = listView?.container?.querySelector('slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('Ignores ids-list-view-item elements if IdsListView.data attribute is set', async () => {
    let childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(dataset.length);

    listView.data = deepClone(dataset);
    await processAnimFrame();

    childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(0);
  });

  it('Creates named slots for valid ids-list-view-item child elements', () => {
    const listViewItems = listView?.querySelectorAll('ids-list-view-item');
    expect(listViewItems?.length).toBe(dataset.length);

    const childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    const numSlots = childSlots?.length ?? 0;
    expect(numSlots).toEqual(listViewItems?.length);

    expect(childSlots?.[0]?.getAttribute('name')).toBe('slot-child-0');
    expect(listViewItems?.[0]?.getAttribute('slot')).toBe('slot-child-0');

    expect(childSlots?.[numSlots - 1]?.getAttribute('name')).toBe(`slot-child-${numSlots - 1}`);
    expect(listViewItems?.[numSlots - 1]?.getAttribute('slot')).toBe(`slot-child-${numSlots - 1}`);
  });

  it('Removes named slots once ids-list-view-item is removed from DOM', async () => {
    const listViewItems = listView?.querySelectorAll('ids-list-view-item');
    expect(listViewItems?.length).toBe(dataset.length);

    let childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(dataset.length);

    listViewItems[0].remove();
    listViewItems[1].remove();
    listViewItems[2].remove();
    await processAnimFrame();

    childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(dataset.length - 3);
  });

  it('Ignores child elements that are not valid ids-list-view-item elements', async () => {
    listView.innerHTML = `
      <ids-text font-size="16" type="h2">Invalid Item 0</ids-text>
      <ids-list-view-item>
        <ids-text font-size="16" type="h2">Valid Item 1</ids-text>
      </ids-list-view-item>
      <ids-text font-size="16" type="h2">Invalid Item 2</ids-text>
      <ids-list-view-item>
        <ids-text font-size="16" type="h2">Valid Item 3</ids-text>
      </ids-list-view-item>
      <ids-text font-size="16" type="h2">Invalid Item 4</ids-text>
      <ids-list-view-item>
        <ids-text font-size="16" type="h2">Valid Item 5</ids-text>
      </ids-list-view-item>
      <ids-text font-size="16" type="h2">Invalid Item 6</ids-text>
    `;

    await processAnimFrame();

    expect(listView?.children.length).toEqual(7);
    const defaultSlot = listView?.container?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect((defaultSlot?.assignedElements() ?? []).length).toEqual(4);

    const childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(3);
  });

  it('Can find text in ids-list-view-item elements when searchable enabled', async () => {
    expect(listView.searchable).toBeFalsy();

    listView.searchable = true;
    expect(listView.searchable).toBeTruthy();
    expect(listView.searchField).toBeTruthy();

    expect(listView.searchField?.value).toBe('');

    const listViewItems = listView?.querySelectorAll('ids-list-view-item');
    expect(listViewItems?.length).toBe(dataset.length);

    let childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(dataset.length);

    const numBeefProducts = dataset.filter((item) => item.productName.includes('Beef'));
    expect(numBeefProducts.length > 0).toBe(true);
    expect(numBeefProducts.length).toBe(3);

    (listView.searchField as any).value = 'Beef';

    await processAnimFrame();

    childSlots = listView?.container?.querySelectorAll('slot[name^="slot-child"]');
    expect(childSlots?.length).toEqual(numBeefProducts.length);
  });
});
