// Menu Selection Types
const MENU_GROUP_SELECT_TYPES = [
  'none',
  'single',
  'multiple'
];

// @TODO handle other menu-item sizes
const MENU_ITEM_SIZE = 'medium';

// Default Button state values
const MENU_DEFAULTS = {
  disabled: false,
  icon: null,
  selected: false,
  submenu: null,
  tabIndex: 0,
  value: null,
};

// Definable attributes
const MENU_ATTRIBUTES = [
  attributes.DISABLED,
  attributes.ICON,
  attributes.LANGUAGE,
  attributes.SELECTED,
  attributes.SUBMENU,
  attributes.TABINDEX,
  attributes.VALUE,
  attributes.MODE,
  attributes.VERSION
];

/**
 * Determines if a menu item's stored value can safely be described by its attribute inside the DOM.
 * @param {any} value the value to be checked
 * @returns {boolean} true if the value can be "stringified" safely for the DOM attribute
 */
 function safeForAttribute(value) {
  return value !== null && ['string', 'number', 'boolean'].includes(typeof value);
}

/**
 * @private
 * @param {string|IdsMenuGroup} menuGroup the group to search for
 * @param {IdsMenu} idsMenu the parent menu element
 * @returns {IdsMenuGroup|undefined} if valid, a reference to the menu group.
 * Otherwise, returns undefined.
 */
 function isValidGroup(menuGroup, idsMenu) {
  let hasGroup;

  const isElem = menuGroup instanceof IdsMenuGroup;
  idsMenu.groups.forEach((group) => {
    if ((isElem && group.isEqualNode(menuGroup)) || (group?.id === menuGroup)) {
      hasGroup = group;
    }
  });
  return hasGroup;
}

/**
 * @private
 * @param {IdsMenuItem} item the element to be checked
 * @param {HTMLElement} idsMenu the parent menu element
 * @returns {boolean} true if the provided element is a "currently-usable" IdsMenuItem type.
 */
function isUsableItem(item, idsMenu) {
  const isItem = item instanceof IdsMenuItem;
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

export { MENU_GROUP_SELECT_TYPES, MENU_ITEM_SIZE, MENU_DEFAULTS, MENU_ATTRIBUTES, safeForAttribute, isValidGroup, isUsableItem };