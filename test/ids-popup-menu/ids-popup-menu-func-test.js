/**
 * @jest-environment jsdom
 */
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/ids-popup-menu/ids-popup-menu';

const exampleHTML = `
  <ids-menu-group id="primary">
    <ids-menu-header id="header">My Items</ids-menu-header>
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary">
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">
      Item 6
      <ids-popup-menu>
        <ids-menu-group>
          <ids-menu-item id="subitem-1">Sub-Item 1</ids-menu-item>
          <ids-menu-item id="subitem-1">Sub-Item 2</ids-menu-item>
          <ids-menu-item id="subitem-1">Sub-Item 3</ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>
    </ids-menu-item>
  </ids-menu-group>
`;

describe('IdsPopupMenu Component', () => {
  let menu;
  let group1;
  let group2;
  let header;
  let item1;
  let item2;
  let item3;
  let sep1;
  let sep2;
  let item4;
  let item5;
  let item6;

  beforeEach(async () => {
    menu = new IdsPopupMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);

    group1 = document.querySelector('#primary');
    group2 = document.querySelector('#secondary');
    header = document.querySelector('#header');
    item1 = document.querySelector('#item1');
    item2 = document.querySelector('#item2');
    item3 = document.querySelector('#item3');
    item4 = document.querySelector('#item4');
    item5 = document.querySelector('#item5');
    item6 = document.querySelector('#item6');
    sep1 = document.querySelector('#sep1');
    sep2 = document.querySelector('#sep2');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    group1 = null;
    group2 = null;
    header = null;
    item1 = null;
    item2 = null;
    item3 = null;
    item4 = null;
    item5 = null;
    item6 = null;
    sep1 = null;
    sep2 = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-popup-menu').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can programmatically show and hide', () => {
    menu.show();

    expect(menu.hidden).toBeFalsy();
    expect(menu.popup.visible).toBeTruthy();

    menu.hide();

    expect(menu.hidden).toBeTruthy();
    expect(menu.popup.visible).toBeFalsy();
  });

  it('listens for `selected` event from menu items', (done) => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });
    menu.addEventListener('selected', mockCallback);

    menu.show();
    setTimeout(() => {
      item1.select();

      setTimeout(() => {
        expect(mockCallback.mock.calls.length).toBe(1);
        done();
      }, 20);
    }, 20);
  });

  /*
  it('can explain when document click events are attached', (done) => {
    menu.show();

    setTimeout(() => {
      debugger;
      expect(menu.hasOpenEvents).toBeTruthy();

      menu.hide();
      setTimeout(() => {
        expect(menu.hasOpenEvents).toBeFalsy();
        done();
      }, 20);
    }, 20);
  });
  */
});
