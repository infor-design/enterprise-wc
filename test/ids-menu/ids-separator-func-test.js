/**
 * @jest-environment jsdom
 */
import IdsMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/components/ids-menu/ids-menu';

// Appended to the menu once it's in the DOM
const exampleHTML = `
  <ids-menu-group id="group1">
    <ids-menu-item id="item1">Item 1</ids-menu-item>
    <ids-menu-item id="item2">Item 2</ids-menu-item>
    <ids-menu-item id="item3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="group2">
    <ids-menu-item id="item4">Item 4</ids-menu-item>
    <ids-menu-item id="item5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6">Item 6</ids-menu-item>
  </ids-menu-group>
`;

describe('IdsSeparator', () => {
  let menu;
  let sep1;
  let sep2;

  beforeEach(() => {
    menu = new IdsMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);

    sep1 = document.querySelector('#sep1');
    sep2 = document.querySelector('#sep2');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    sep1 = null;
    sep2 = null;
  });

  it('container will be a div when invoked within a menu', () => {
    expect(sep1.container.tagName.toLowerCase()).toEqual('div');
  });

  it('container will be a list item when invoked within a menu group', () => {
    expect(sep2.container.tagName.toLowerCase()).toEqual('li');
  });
});
