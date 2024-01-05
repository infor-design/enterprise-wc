/**
 * @jest-environment jsdom
 */
import IdsListView, { IdsListViewSelectedItem } from '../../src/components/ids-list-view/ids-list-view';
import type IdsListViewItem from '../../src/components/ids-list-view/ids-list-view-item';
import dataset from '../../src/assets/data/products-100.json';
import datasetProducts from '../../src/assets/data/products.json';
import processAnimFrame from '../helpers/process-anim-frame';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

import '../../src/components/ids-card/ids-card';
import IdsVirtualScroll from '../../src/components/ids-virtual-scroll/ids-virtual-scroll';
import IdsPagerNumberList from '../../src/components/ids-pager/ids-pager-number-list';
import IdsButton from '../../src/components/ids-button/ids-button';

// Default settings
const LIST_VIEW_DEFAULTS = {
  hideCheckboxes: false, // Only apply to selectable multiple
  height: '100%',
  label: 'Ids list view',
  selectableOptions: ['single', 'multiple', 'mixed'],
  sortable: false,
  suppressDeactivation: false, // Use with Mixed selection only
  suppressDeselection: true, // Use with Single selection only
  virtualScroll: false
};

describe('IdsListView Component', () => {
  let listView: IdsListView;
  const originalOffsetHeight: any = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  const originalOffsetWidth: any = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeEach(async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 320 });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 320 });

    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = deepClone(dataset);
    await processAnimFrame();
  });

  afterEach(async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    document.body.innerHTML = '';
    await processAnimFrame();
  });

  it('renders the template without virtual scroll', () => {
    listView.data = dataset;
    expect(listView.items.length).toEqual(listView.data.length);
  });

  it.skip('renders the template with virtual scroll', async () => {
    await processAnimFrame();
    document.body.innerHTML = '';
    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line

    // TODO Changing order of the appendChilds causes the test to fail
    document.body.appendChild(listView);
    listView.virtualScroll = true;
    listView.data = datasetProducts;
    await processAnimFrame();

    expect(listView.items.length).toEqual(listView.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll')?.visibleItemCount());
  });

  it('renders without errors with no template', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.items.length).toEqual(100);
    expect(errors).not.toHaveBeenCalled();
  });

  it('rerenders without errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    listView.data = [{ productName: 'test' }, { productName: 'test2' }];

    expect(listView.items.length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  it.skip('removes the virtualScroll attribute when reset', async () => {
    listView.virtualScroll = true;
    await processAnimFrame();
    expect(listView.getAttribute('virtual-scroll')).toEqual('true');
    expect(listView.items.length).toEqual(listView.shadowRoot?.querySelector<IdsVirtualScroll>('ids-virtual-scroll')?.visibleItemCount());

    listView.virtualScroll = null;
    await processAnimFrame();
    expect(listView.getAttribute('virtual-scroll')).toEqual(null);
    expect(listView.items.length).toEqual(100);
  });

  it('render with empty data', () => {
    listView.data = null;
    expect(listView.items.length).toEqual(0);
    listView.container?.setAttribute('dir', 'rtl');
    listView.data = deepClone(dataset);
    expect(listView.items.length).toEqual(100);
    listView.data = [];
    expect(listView.items.length).toEqual(0);
  });

  it('supports setting height', () => {
    listView.height = '600px';
    expect(listView.getAttribute('height')).toEqual('600px');
    listView.height = undefined;
    expect(listView.getAttribute('height')).toEqual('100%');
  });

  it('supports setting itemHeight', () => {
    listView.itemHeight = '40px';
    expect(listView.getAttribute('item-height')).toEqual('40px');
    listView.itemHeight = undefined;
    expect(listView.getAttribute('item-height')).toBeFalsy();
  });

  it('supports setting sortable', () => {
    listView.sortable = true;
    expect(listView.getAttribute('sortable')).toEqual('true');
    expect(listView.getAllSwappableItems()?.length).toEqual(0);
    listView.sortable = null;
    expect(listView.getAttribute('sortable')).toEqual(null);
  });

  it('supports setting focus', () => {
    listView.focus();
    expect((document.activeElement as any).tagName).toEqual('BODY');
  });

  it('supports sorting', () => {
    document.body.innerHTML = '';
    listView = new IdsListView();
    listView.sortable = true;
    // eslint-disable-next-line no-template-curly-in-string
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>';
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.items[0]?.sortable).toBeTruthy();
    listView.remove();
  });

  it('focuses on click', async () => {
    const sel = 'ids-list-view-item:nth-child(3)';
    expect(listView.container?.querySelector<HTMLElement>(sel)?.getAttribute('tabindex')).toEqual('-1');
    listView.container?.querySelector<HTMLElement>(sel)?.click();
    await processAnimFrame();
    expect(listView.container?.querySelector<HTMLElement>(sel)?.getAttribute('tabindex')).toEqual('0');
  });

  it('can use arrow keys to navigate', async () => {
    listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item')?.click();
    await processAnimFrame();
    expect(listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item[tabindex="0"] ids-text')?.innerHTML).toContain('Steampan Lid');
    listView.getPreviousLi('test');
    listView.getNextLi('test');
    listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item')?.focus();
    let event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    expect(listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item[tabindex="0"] ids-text')?.innerHTML).toContain('Onions - Red');

    event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    expect(listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item[tabindex="0"] ids-text')?.innerHTML).toContain('Steampan Lid');

    // Does nothing just the bounds case
    event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    expect(listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item[tabindex="0"] ids-text')?.innerHTML).toContain('Steampan Lid');

    event = new KeyboardEvent('keydown', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    expect(listView.shadowRoot?.querySelector<HTMLElement>('ids-list-view-item[tabindex="0"] ids-text')?.innerHTML).toContain('Steampan Lid');
  });

  it('can single select with keyboard', async () => {
    listView.selectable = 'single';
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;

    expect(listView.selected).toEqual(null);
    listView.shadowRoot?.querySelector<HTMLElement>(sel(1))?.focus();
    let event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect(listView.selected).toEqual(expect.objectContaining({ index: 0 }));
    listView.shadowRoot?.querySelector<HTMLElement>(sel(1))?.focus();
    event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    listView.shadowRoot?.querySelector<HTMLElement>(sel(3))?.focus();
    event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect(listView.selected).toEqual(expect.objectContaining({ index: 2 }));
    listView.shadowRoot?.querySelector<HTMLElement>(sel(3))?.focus();
    event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect(listView.selected).toEqual(null);
  });

  it('can mixed select with keyboard', async () => {
    listView.selectable = 'mixed';
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;

    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(0);
    listView.shadowRoot?.querySelector<HTMLElement>(sel(1))?.focus();
    const event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(1);
  });

  it.skip('can select/deselect thru api', async () => {
    document.body.innerHTML = `<ids-list-view id="lv-test" item-height="76" pagination="client-side" page-number="1" page-size="5">
      <template><ids-text>\${productName}</ids-text></template></ids-list-view>
    </ids-list-view>`;
    await processAnimFrame();
    listView = document.querySelector('ids-list-view') as IdsListView;
    listView.data = deepClone(dataset);
    await processAnimFrame();
    expect(listView).toBeTruthy();
    listView.selectable = 'single';
    expect(listView.selected).toEqual(null);
    listView.select(10);
    expect(listView.selected).toEqual(expect.objectContaining({ index: 10 }));
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="3"]')?.click();
    await processAnimFrame();
    listView.select(3);
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="1"]')?.click();
    await processAnimFrame();
    listView.suppressDeselection = false;
    listView.select(3);
    listView.suppressDeselection = true;
    listView.select(3);
    listView.select(4);
    listView.select(4);
    expect(listView.selected).toEqual(null);
    listView.select(9);
    listView.select(8);
    listView.select(8);
    expect(listView.selected).toEqual(null);
  });

  it('can select/deselect all thru api', () => {
    const mockCallback = jest.fn();
    listView.addEventListener('selectionchanged', mockCallback);
    listView.selectable = 'single';
    expect(listView.selected).toEqual(null);
    listView.selectAll();
    expect(listView.selected).toEqual(expect.objectContaining({ index: 0 }));
    listView.deselectAll();
    expect(listView.selected).toEqual(null);
    listView.selectable = 'multiple';
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(0);
    listView.selectAll();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(99);
    listView.deselectAll();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(0);
    expect(mockCallback).toHaveBeenCalled();
  });

  it.skip('can activateItem/deactivateItem thru api', async () => {
    document.body.innerHTML = `<ids-list-view id="lv-test" item-height="76" pagination="client-side" page-number="1" page-size="5">
      <template><ids-text>\${productName}</ids-text></template></ids-list-view>
    </ids-list-view>`;
    await processAnimFrame();
    listView = document.querySelector('ids-list-view') as IdsListView;
    listView.data = deepClone(dataset);
    await processAnimFrame();
    expect(listView).toBeTruthy();
    listView.selectable = 'mixed';
    listView.activateItem(-1);
    expect(listView.activatedItem).toEqual(null);
    listView.activateItem(1);
    expect(listView.activatedItem).toEqual(null);
    listView.activateItem(2);
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 2 }));
    listView.activateItem(3);
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 3 }));
    listView.deactivateItem(3);
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 3 }));
    listView.suppressDeactivation = true;
    listView.deactivateItem(3);
    expect(listView.activatedItem).toEqual(null);
    listView.activateItem(10);
    listView.activateItem(10);
    listView.activateItem(9);
    listView.activateItem(8);
    listView.deactivateItem(12);
    listView.suppressDeactivation = false;
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="3"]')?.click();
    await processAnimFrame();
    listView.activateItem(8);
    listView.activateItem(8);
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 8 }));
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="1"]')?.click();
    await processAnimFrame();
    listView.suppressDeactivation = true;
    listView.activateItem(8);
    listView.deactivateItem(8);
    expect(listView.activatedItem).toEqual(null);
  });

  it('can multiple select with keyboard', async () => {
    listView.selectable = 'multiple';
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;

    expect((listView.selected as IdsListViewSelectedItem[])?.length).toEqual(0);
    listView.shadowRoot?.querySelector<HTMLElement>(sel(1))?.focus();
    let event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect((listView.selected as IdsListViewSelectedItem[])?.length).toEqual(1);
    listView.shadowRoot?.querySelector<HTMLElement>(sel(1))?.focus();
    event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
    listView.container?.dispatchEvent(event);
    await processAnimFrame();
    listView.shadowRoot?.querySelector<HTMLElement>(sel(3))?.focus();
    event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect((listView.selected as IdsListViewSelectedItem[])?.length).toEqual(2);
    listView.shadowRoot?.querySelector<HTMLElement>(sel(3))?.focus();
    event = new KeyboardEvent('keyup', { code: 'Space' });
    listView.container?.dispatchEvent(event);
    expect((listView.selected as IdsListViewSelectedItem[])?.length).toEqual(1);
  });

  it.skip('renders with card', async () => {
    document.body.innerHTML = `<ids-card>
      <div slot="card-header">
        <ids-text font-size="20" type="h2">Product List</ids-text>
      </div>
      <div slot="card-content">
        <ids-list-view
          id="lv-card-example"
          pagination="client-side"
          page-number="1"
          page-size="5",
          pager-container="#lv-card-footer"
        >
          <template><ids-text type="h2">\${productName}</ids-text></template></ids-list-view>
        </ids-list-view>
      </div>
      <div slot="card-footer" id="lv-card-footer" no-padding>
      </div>
    </ids-card>`;
    await processAnimFrame();
    listView = document.querySelector('#lv-card-example') as IdsListView;
    listView.data = dataset;
    listView.pageTotal = 100;
    await processAnimFrame();
    expect(listView).toBeTruthy();
    expect(listView.items.length).toEqual(5);
    expect(document.querySelector('#lv-card-footer ids-pager')).toBeTruthy();
  });

  it('should set the aria label text', async () => {
    expect(listView.getAttribute('label')).toEqual(null);
    expect(listView.body?.getAttribute('aria-label')).toEqual(LIST_VIEW_DEFAULTS.label);
    expect(listView.label).toEqual(LIST_VIEW_DEFAULTS.label);
    listView.setAttribute('label', 'test');
    expect(listView.getAttribute('label')).toEqual('test');
    expect(listView.body?.getAttribute('aria-label')).toEqual('test');
    expect(listView.label).toEqual('test');
    listView.removeAttribute('label');
    expect(listView.getAttribute('label')).toEqual(null);
    expect(listView.body?.getAttribute('aria-label')).toEqual(LIST_VIEW_DEFAULTS.label);
    expect(listView.label).toEqual(LIST_VIEW_DEFAULTS.label);
  });

  it('should set the selectable setting', async () => {
    expect(listView.getAttribute('selectable')).toEqual(null);
    listView.selectable = 'single';
    expect(listView.getAttribute('selectable')).toEqual('single');
    listView.selectable = 'multiple';
    expect(listView.getAttribute('selectable')).toEqual('multiple');
    listView.selectable = 'mixed';
    expect(listView.getAttribute('selectable')).toEqual('mixed');
    listView.selectable = 'test';
    expect(listView.getAttribute('selectable')).toEqual(null);
  });

  it('should set the setting to allow deselect', async () => {
    listView.selectable = 'single';
    expect(listView.getAttribute('suppress-deselection')).toEqual(null);
    expect(listView.suppressDeselection).toEqual(LIST_VIEW_DEFAULTS.suppressDeselection);
    listView.setAttribute('suppress-deselection', 'true');
    expect(listView.getAttribute('suppress-deselection')).toEqual('true');
    expect(listView.suppressDeselection).toEqual(true);
    listView.setAttribute('suppress-deselection', 'false');
    expect(listView.getAttribute('suppress-deselection')).toEqual('false');
    expect(listView.suppressDeselection).toEqual(false);
    listView.setAttribute('suppress-deselection', 'test');
    expect(listView.getAttribute('suppress-deselection')).toEqual('test');
    expect(listView.suppressDeselection).toEqual(true);
    listView.removeAttribute('suppress-deselection');
    expect(listView.getAttribute('suppress-deselection')).toEqual(null);
    expect(listView.suppressDeselection).toEqual(LIST_VIEW_DEFAULTS.suppressDeselection);
  });

  it('should set the setting to allow deactivate', async () => {
    listView.selectable = 'mixed';
    expect(listView.getAttribute('suppress-deactivation')).toEqual(null);
    expect(listView.suppressDeactivation).toEqual(LIST_VIEW_DEFAULTS.suppressDeactivation);
    listView.setAttribute('suppress-deactivation', 'true');
    expect(listView.getAttribute('suppress-deactivation')).toEqual('true');
    expect(listView.suppressDeactivation).toEqual(true);
    listView.setAttribute('suppress-deactivation', 'false');
    expect(listView.getAttribute('suppress-deactivation')).toEqual('false');
    expect(listView.suppressDeactivation).toEqual(false);
    listView.setAttribute('suppress-deactivation', 'test');
    expect(listView.getAttribute('suppress-deactivation')).toEqual('test');
    expect(listView.suppressDeactivation).toEqual(true);
    listView.removeAttribute('suppress-deactivation');
    expect(listView.getAttribute('suppress-deactivation')).toEqual(null);
    expect(listView.suppressDeactivation).toEqual(LIST_VIEW_DEFAULTS.suppressDeactivation);
  });

  it('should set the setting to hide checkboxes', async () => {
    listView.selectable = 'multiple';
    expect(listView.getAttribute('hide-checkboxes')).toEqual(null);
    expect(listView.hideCheckboxes).toEqual(LIST_VIEW_DEFAULTS.hideCheckboxes);
    listView.setAttribute('hide-checkboxes', 'true');
    expect(listView.getAttribute('hide-checkboxes')).toEqual('true');
    expect(listView.hideCheckboxes).toEqual(true);
    listView.setAttribute('hide-checkboxes', 'false');
    expect(listView.getAttribute('hide-checkboxes')).toEqual('false');
    expect(listView.hideCheckboxes).toEqual(false);
    listView.setAttribute('hide-checkboxes', 'test');
    expect(listView.getAttribute('hide-checkboxes')).toEqual('test');
    expect(listView.hideCheckboxes).toEqual(true);
    listView.removeAttribute('hide-checkboxes');
    expect(listView.getAttribute('hide-checkboxes')).toEqual(null);
    expect(listView.hideCheckboxes).toEqual(LIST_VIEW_DEFAULTS.hideCheckboxes);
  });

  it('should set the setting to hide checkboxes with pre selected', async () => {
    const ds: any = deepClone(dataset);
    ds[0].itemSelected = true;
    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    expect(listView.selected).toEqual(null);
    listView.selectable = 'multiple';
    listView.hideCheckboxes = true;
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    await processAnimFrame();
    listView.data = ds;
    await processAnimFrame();
    expect(listView.getAttribute('hide-checkboxes')).toEqual('true');
    expect(listView.shadowRoot?.querySelectorAll('.list-item-checkbox').length).toEqual(0);
  });

  it.skip('should check if given data index in current page', async () => {
    expect(listView.isInPage('test' as any)).toEqual(false);
    expect(listView.isInPage(3)).toEqual(true);
    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.virtualScroll = true;
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    listView.data = datasetProducts;
    await processAnimFrame();
    expect(listView.isInPage(3)).toEqual(true);
  });

  it.skip('should get data index for given page index', async () => {
    document.body.innerHTML = `<ids-list-view id="lv-test" item-height="76" pagination="client-side" page-number="1" page-size="5">
      <template><ids-text>\${productName}</ids-text></template></ids-list-view>
    </ids-list-view>`;
    await processAnimFrame();
    listView = document.querySelector('ids-list-view') as IdsListView;
    listView.data = dataset;
    await processAnimFrame();
    expect(listView).toBeTruthy();
    expect(listView.dataIndex('test' as any)).toEqual(null);
    expect(listView.dataIndex(3)).toEqual(3);
    expect(listView.dataIndex(7)).toEqual(null);
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="3"]')?.click();
    await processAnimFrame();
    expect(listView.dataIndex(-1)).toEqual(null);
    expect(listView.dataIndex(2)).toEqual(12);
    expect(listView.dataIndex(7)).toEqual(null);
  });

  it.skip('should get page index for given data index', async () => {
    document.body.innerHTML = `<ids-list-view id="lv-test" item-height="76" pagination="client-side" page-number="1" page-size="5">
      <template><ids-text>\${productName}</ids-text></template></ids-list-view>
    </ids-list-view>`;
    await processAnimFrame();
    listView = document.querySelector('ids-list-view') as IdsListView;
    listView.data = dataset;
    await processAnimFrame();
    expect(listView).toBeTruthy();
    expect(listView.pageIndex('test' as any)).toEqual(null);
    expect(listView.pageIndex(3)).toEqual(3);
    expect(listView.pageIndex(7)).toEqual(null);
    expect(listView.pageIndex(-1)).toEqual(null);
    listView.shadowRoot?.querySelector<IdsPagerNumberList>('ids-pager-number-list')?.shadowRoot?.querySelector<IdsButton>('ids-button[data-id="3"]')?.click();
    await processAnimFrame();
    expect(listView.pageIndex(3)).toEqual(null);
    expect(listView.pageIndex(12)).toEqual(2);
    expect(listView.pageIndex(15)).toEqual(null);
  });

  it('should veto before selected', async () => {
    listView.selectable = 'multiple';
    await processAnimFrame();
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;
    let veto: boolean;
    listView.addEventListener('beforeselected', ((e: CustomEvent) => {
      e.detail.response(veto);
    }) as EventListener);
    veto = false;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(0);
    veto = true;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(1);
    await processAnimFrame();
  });

  it('should veto before deselected', async () => {
    listView.selectable = 'multiple';
    await processAnimFrame();
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;
    let veto: boolean;
    listView.addEventListener('beforedeselected', ((e: CustomEvent) => {
      e.detail.response(veto);
    }) as EventListener);
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(1);
    veto = false;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(1);
    veto = true;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect((listView.selected as IdsListViewSelectedItem[]).length).toEqual(0);
  });

  it('should veto before item activated', async () => {
    listView.selectable = 'mixed';
    await processAnimFrame();
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;
    let veto: boolean;
    listView.addEventListener('beforeactivated', ((e: CustomEvent) => {
      e.detail.response(veto);
    }) as EventListener);
    veto = false;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect(listView.activatedItem).toEqual(null);
    veto = true;
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 2 }));
  });

  it('should veto before item deactivated', async () => {
    listView.selectable = 'mixed';
    await processAnimFrame();
    const sel = (nth: number) => `ids-list-view-item:nth-child(${nth})`;
    let veto: boolean;
    listView.addEventListener('beforedeactivated', ((e: CustomEvent) => {
      e.detail.response(veto);
    }) as EventListener);
    listView.container?.querySelector<HTMLElement>(sel(3))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 2 }));
    veto = false;
    listView.container?.querySelector<HTMLElement>(sel(4))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 2 }));
    veto = true;
    listView.container?.querySelector<HTMLElement>(sel(4))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 3 }));
    listView.container?.querySelector<HTMLElement>(sel(4))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 3 }));
    listView.suppressDeactivation = true;
    veto = false;
    listView.container?.querySelector<HTMLElement>(sel(4))?.click();
    expect(listView.activatedItem).toEqual(expect.objectContaining({ index: 3 }));
    veto = true;
    listView.container?.querySelector<HTMLElement>(sel(4))?.click();
    expect(listView.activatedItem).toEqual(null);
  });

  it('should not have errors when changing data by activating an item', () => {
    let activatedItem = -1;

    listView.addEventListener('activated', (e: any) => {
      activatedItem = e.detail.index;

      listView.data = [
        { productName: 'new product 1' },
        { productName: 'new product 2' },
      ];
    });

    listView.activateItem(0);
    expect(activatedItem).toEqual(0);

    listView.activateItem(1);
    expect(activatedItem).toEqual(1);
  });
});
