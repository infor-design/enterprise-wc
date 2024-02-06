import { getClosestRootNode } from '../../utils/ids-dom-utils/ids-dom-utils';

export type IdsMenuItemData = {
  id?: string;
  comment?: string;
  disabled?: boolean;
  icon?: string;
  selected?: boolean;
  shortcutKeys?: string;
  submenu?: IdsMenuData;
  text: string;
  type: 'item';
  value?: string | null;
};

export type IdsMenuHeaderData = {
  for?: string;
  text: string;
  type: 'header';
};

export type IdsMenuSeparatorData = {
  type: 'separator';
};

export type IdsMenuContentsData = Array<IdsMenuGroupData | IdsMenuSeparatorData | IdsMenuHeaderData>;

export type IdsMenuGroupData = {
  id?: string;
  items: Array<IdsMenuItemData | IdsMenuSeparatorData | IdsMenuHeaderData>;
  select?: 'none' | 'single' | 'multiple';
  type?: 'group';
};

export type IdsMenuObjectData = {
  id?: string;
  contents?: IdsMenuContentsData;
  length?: number;
};

export type IdsMenuData = IdsMenuObjectData | IdsMenuContentsData;

// Menu Selection Types
const MENU_GROUP_SELECT_TYPES = [
  'none',
  'single',
  'multiple'
];

// Default Button state values
const MENU_DEFAULTS: any = {
  disabled: false,
  icon: null,
  selected: false,
  shortcutKeys: null,
  submenu: null,
  tabIndex: 0,
  value: null,
};

/**
 * Determines if a menu item's stored value can safely be described by its attribute inside the DOM.
 * @param {any} value the value to be checked
 * @returns {boolean} true if the value can be "stringified" safely for the DOM attribute
 */
function safeForAttribute(value: any) {
  return value !== null && ['string', 'number', 'boolean'].includes(typeof value);
}

/**
 * @private
 * @param {string|HTMLElement} menuGroup the group to search for
 * @param {HTMLElement} idsMenu the parent menu element
 * @returns {HTMLElement|undefined} if valid, a reference to the menu group.
 * Otherwise, returns undefined.
 */
function isValidGroup(menuGroup: any, idsMenu: any) {
  let hasGroup;

  // eslint-disable-next-line no-undef
  const isGroup = menuGroup !== undefined && menuGroup.nodeName === 'IDS-MENU-GROUP';
  idsMenu.groups.forEach((group: any) => {
    if ((isGroup && group.isEqualNode(menuGroup)) || (group?.id === menuGroup)) {
      hasGroup = group;
    }
  });
  return hasGroup;
}

/**
 * @private
 * @param {HTMLElement} item the element to be checked
 * @param {HTMLElement} idsMenu the parent menu element
 * @returns {boolean} true if the provided element is a "currently-usable" IdsMenuItem type.
 */
function isUsableItem(item: any, idsMenu: any) {
  const isItem = item?.nodeName === 'IDS-MENU-ITEM';
  if (!isItem) {
    return false;
  }

  // The item is only usable if it's contained by the correct IdsMenu
  const menuHasItem = idsMenu.contains(item);

  // In some nested cases, we need to detect the item's Shadow Root containment to accurately
  // figure out if it's slotted inside the same menu.
  const closestItemRoot = getClosestRootNode(item.assignedSlot);
  const itemInMenuShadow = closestItemRoot?.menu?.isEqualNode(idsMenu);

  return (itemInMenuShadow || menuHasItem) && !item.disabled;
}

export {
  MENU_GROUP_SELECT_TYPES, MENU_DEFAULTS, safeForAttribute, isValidGroup, isUsableItem
};
