import { eventPath, findInPath, HTMLElementEvent } from '../../utils/ids-event-path-utils/ids-event-path-utils';
import {
  containerHeaderArgs,
  containerBodyCellArgs,
  IdsDataGridContainerArgs
} from './ids-data-grid-container-arguments';

import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';
import type IdsDataGrid from './ids-data-grid';

/**
 * Contextmenu arguments interface.
 */
export interface IdsDataGridContextmenuArgs extends IdsDataGridContainerArgs {
  /* The popup menu element attached with contextmenu */
  menuEl?: IdsPopupMenu;
  /* The origin event dispatched */
  menuSelectedEvent?: any;
  /* The selected value for menu item */
  menuSelectedValue?: string;
}

/**
 * Selected event type for contextmenu.
 */
export type IdsDataGridContextmenuSelected = HTMLElementEvent<HTMLElement[]> & {
  detail: { value: string }
};

/**
 * Get context menu element
 * @param {IdsDataGrid} this The data grid object.
 * @param {boolean} isHeader menu for header vs body.
 * @returns {IdsPopupMenu|undefined} The menu element.
 */
export function getContextmenuElem(this: IdsDataGrid, isHeader = false): IdsPopupMenu | undefined {
  const slotName = isHeader ? 'header-contextmenu' : 'contextmenu';
  const id = isHeader ? this.headerMenuId : this.menuId;
  const data = isHeader ? this.headerMenuData : this.menuData;
  const slot = (): any => this.shadowRoot?.querySelector(`slot[name="${slotName}"]`);
  let menu = slot()?.assignedElements()[0];
  if (!menu && id) {
    menu = this.closest('ids-container')?.querySelector(`#${id}`);
  }
  if (!menu && data) {
    this.insertAdjacentHTML('beforeend', `<ids-popup-menu slot="${slotName}" trigger-type="custom"></ids-popup-menu>`);
    menu = slot()?.assignedElements()[0];
    if (menu) menu.data = data;
  }
  return menu;
}

/**
 * Set compulsory attributes to given menu.
 * @private
 * @param {IdsPopupMenu} menu The menu element.
 * @returns {void}
 */
function setContextmenuCompulsoryAttributes(menu?: IdsPopupMenu): void {
  menu?.popup?.setAttribute('align', 'top, left');
  menu?.setAttribute('data-contextmenu-element', '');
}

/**
 * Show contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {MouseEvent} e The contextmenu event.
 * @returns {void}
 */
function showContextmenu(this: IdsDataGrid, e: MouseEvent): boolean {
  const { menu: menuEl, target, callbackArgs } = this.contextmenuInfo;
  let isShow = false;
  if (menuEl && target && callbackArgs) {
    const args = { ...callbackArgs, menuEl };
    const isHeaderMenu = callbackArgs.type === 'header';

    // Trigger before menu show event
    this.isDynamicContextmenu = true;
    if (!this.triggerVetoableEvent('beforemenushow', args)) {
      this.isDynamicContextmenu = false;
      return isShow;
    }

    // Adjust dynamicly changed context menu data
    if (!this.isDynamicContextmenu) {
      menuEl.data = isHeaderMenu ? this.headerMenuData : this.menuData;
      menuEl.popup?.setAttribute('align', 'top, left');
    }
    this.isDynamicContextmenu = false;

    // Adjust menu
    menuEl.popup?.setPosition?.(e.clientX, e.clientY, false, true);

    menuEl.show();
    isShow = true;

    // Adjust overflow menu items
    const menuHeight = menuEl.popup?.offsetHeight ?? 0;
    const wrapperHeight = this.wrapper?.offsetHeight ?? 0;
    if (wrapperHeight > 0 && menuHeight > wrapperHeight) {
      menuEl.popup?.setAttribute('max-height', `${wrapperHeight}px`);
      menuEl.popup?.place();
    }

    // Set focus on correct menu item
    menuEl.focusTarget.focus();

    this.triggerEvent('menushow', this, {
      bubbles: true, detail: { elem: this, data: args }
    });
  }
  return isShow;
}

/**
 * Handle contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {MouseEvent} e The contextmenu event.
 * @param {IdsPopupMenu} menu The contextmenu element.
 * @param {IdsPopupMenu} headerMenu The header contextmenu element.
 * @returns {void}
 */
function handleContextmenu(
  this: IdsDataGrid,
  e: MouseEvent,
  menu?: IdsPopupMenu,
  headerMenu?: IdsPopupMenu,
): void {
  const path = eventPath(e);
  if (menu?.visible) menu?.hide();
  if (headerMenu?.visible) headerMenu?.hide();
  this.contextmenuInfo = {};

  let args: { menu?: IdsPopupMenu, target?: HTMLElement, callbackArgs?: IdsDataGridContextmenuArgs } = {};
  const columnheader = findInPath(path, '[role="columnheader"]');
  const cellEl = findInPath(path, '[role="gridcell"]');

  if (cellEl && menu) {
    const callbackArgs = containerBodyCellArgs.apply(this, [path, cellEl]);
    args = { menu, target: cellEl, callbackArgs };
  } else if (columnheader && headerMenu) {
    const callbackArgs = containerHeaderArgs.apply(this, [path, columnheader]);
    args = { menu: headerMenu, target: columnheader, callbackArgs };
  }

  this.contextmenuInfo = { ...args };

  if (showContextmenu.apply(this, [e])) e.preventDefault();
}

/**
 * Handle selected item for contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {IdsDataGridContextmenuSelected} e The selected item event for contextmenu.
 * @param {IdsPopupMenu} menuEl The menu element for contextmenu.
 * @returns {void}
 */
function handleContextmenuSelectedItem(this: IdsDataGrid, e: IdsDataGridContextmenuSelected, menuEl?: IdsPopupMenu): void {
  if (menuEl) {
    const args = {
      data: {
        ...this.contextmenuInfo.callbackArgs,
        menuSelectedEvent: e,
        menuSelectedValue: e?.detail?.value,
        menuEl
      },
      elem: this
    };
    this.triggerEvent('menuselected', this, { bubbles: true, detail: args });
  }
}

/**
 * Set contextmenu
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function setContextmenu(this: IdsDataGrid) {
  this.contextmenuInfo = {};
  const menu: IdsPopupMenu | undefined = getContextmenuElem.apply(this);
  const headerMenu: IdsPopupMenu | undefined = getContextmenuElem.apply(this, [true]);

  if (menu || headerMenu) {
    setContextmenuCompulsoryAttributes(menu);
    setContextmenuCompulsoryAttributes(headerMenu);

    // Contextmenu for header, header group and body cells.
    this.offEvent('contextmenu.datagrid', this.container);
    this.onEvent('contextmenu.datagrid', this.container, (e: MouseEvent) => {
      handleContextmenu.apply(this, [e, menu, headerMenu]);
    });

    // Selected item for body cells.
    if (menu) {
      this.offEvent('selected.datagrid-contextmenu-item', menu);
      this.onEvent('selected.datagrid-contextmenu-item', menu, (e: IdsDataGridContextmenuSelected) => {
        handleContextmenuSelectedItem.apply(this, [e, menu]);
      });
    }

    // Selected item for header, and header group.
    if (headerMenu) {
      this.offEvent('selected.datagrid-header-contextmenu-item', headerMenu);
      this.onEvent('selected.datagrid-header-contextmenu-item', headerMenu, (e: IdsDataGridContextmenuSelected) => {
        handleContextmenuSelectedItem.apply(this, [e, headerMenu]);
      });
    }
  }
}
