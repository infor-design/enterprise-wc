/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsIcon from '../../src/components/ids-icon/ids-icon';
import IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/components/ids-popup-menu/ids-popup-menu';
import waitFor from '../helpers/wait-for';

describe('IdsMenuButton Component', () => {
  let buttonEl;
  let menuEl;

  beforeEach(() => {
    buttonEl = new IdsMenuButton();
    buttonEl.id = 'test-button';
    buttonEl.type = 'secondary';
    buttonEl.dropdownIcon = '';
    document.body.appendChild(buttonEl);

    menuEl = new IdsPopupMenu();
    menuEl.id = 'test-menu';
    document.body.appendChild(menuEl);

    // Connect the components
    buttonEl.menu = 'test-menu';
    menuEl.target = buttonEl;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    buttonEl = null;
    menuEl = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    buttonEl.remove();
    buttonEl = new IdsMenuButton();
    buttonEl.id = 'test-button';
    buttonEl.type = 'secondary';
    buttonEl.dropdownIcon = '';
    document.body.appendChild(buttonEl);

    expect(document.querySelectorAll('ids-menu-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(buttonEl.shouldUpdate).toBeTruthy();
  });

  it('renders correctly', () => {
    const newButtonElem = new IdsMenuButton();
    newButtonElem.id = 'new-button';
    newButtonElem.dropdownIcon = 'more';
    document.body.appendChild(newButtonElem);

    const newMenuElem = new IdsPopupMenu();
    newMenuElem.id = 'new-menu';
    document.body.appendChild(newMenuElem);

    // Connect the components
    newButtonElem.menu = 'new-menu';
    newMenuElem.target = newButtonElem;

    newButtonElem.template();
    expect(newButtonElem.outerHTML).toMatchSnapshot();
  });

  it('can change/remove its dropdown icon', () => {
    buttonEl.dropdownIcon = 'launch';
    let iconEl = buttonEl.button.querySelector('ids-icon');

    expect(buttonEl.dropdownIcon).toBe('launch');
    expect(iconEl.icon).toBe('launch');

    // Remove it
    buttonEl.dropdownIcon = null;
    iconEl = buttonEl.button.querySelector('ids-icon');

    expect(buttonEl.dropdownIcon).toBe(undefined);
    expect(iconEl).toBe(null);

    // Try removing it again (runs the else clause in `set dropdownIcon`)
    buttonEl.dropdownIcon = undefined;
    iconEl = buttonEl.button.querySelector('ids-icon');

    expect(buttonEl.dropdownIcon).toBe(undefined);
    expect(iconEl).toBe(null);
  });

  it('points the menu\'s arrow at the button if there is no icon', () => {
    buttonEl.dropdownIcon = null;
  });

  it('can set active state', () => {
    buttonEl.setActiveState(true);
    expect(buttonEl.button.classList.contains('is-active')).toBeTruthy();

    buttonEl.setActiveState(false);
    expect(buttonEl.button.classList.contains('is-active')).toBeFalsy();
  });

  it('should have active state when menu is open', async () => {
    const waitForOpts = { timeout: 2000 };

    menuEl.show();
    await waitFor(() => expect(buttonEl.button.classList.contains('is-active')).toBeTruthy(), waitForOpts);

    menuEl.hide();
    await waitFor(() => expect(buttonEl.button.classList.contains('is-active')).toBeFalsy(), waitForOpts);
  });

  it('shows/hides the menu when the button is clicked', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });
    buttonEl.dispatchEvent(clickEvent);

    setTimeout(() => {
      expect(menuEl.popup.visible).toBeTruthy();
      done();
    }, 20);
  });

  it('not error if no menu', () => {
    const noMenuButton = new IdsMenuButton();
    document.body.appendChild(noMenuButton);

    expect(() => {
      noMenuButton.configureMenu();
      noMenuButton.resizeMenu();
    }).not.toThrow();
  });

  it('should render an icon button', () => {
    document.body.innerHTML = '';
    buttonEl = new IdsMenuButton();
    buttonEl.id = 'icon-button';

    const iconEl = new IdsIcon();
    iconEl.slot = 'icon';
    iconEl.icon = 'more';
    buttonEl.appendChild(iconEl);

    const spanEl = document.createElement('span');
    spanEl.classList.add('audible');
    spanEl.text = 'Icon Only Button';
    buttonEl.appendChild(spanEl);
    document.body.appendChild(buttonEl);
    buttonEl.render();

    expect(buttonEl.shadowRoot.querySelector('.ids-icon-button')).toBeTruthy();
  });

  it('focuses the button when the menu is closed with the `Escape` key', () => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    menuEl.show();

    setTimeout(() => {
      expect(menuEl.popup.visible).toBeTruthy();
      menuEl.dispatchEvent(closeEvent);

      setTimeout(() => {
        expect(document.activeElement.isEqualNode(buttonEl)).toBeTruthy();
      }, 20);
    }, 20);
  });

  it('can set formatter width', () => {
    expect(buttonEl.getAttribute('formatter-width')).toEqual(null);
    buttonEl.formatterWidth = 150;
    expect(buttonEl.getAttribute('formatter-width')).toEqual('150');
    buttonEl.formatterWidth = '150';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('150');
    buttonEl.formatterWidth = '150px';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('150px');
    buttonEl.formatterWidth = '5em';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('5em');
    buttonEl.formatterWidth = '15rem';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('15rem');
    buttonEl.formatterWidth = '2vh';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('2vh');
    buttonEl.formatterWidth = '2vw';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('2vw');
    buttonEl.formatterWidth = '15ch';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('15ch');
    buttonEl.formatterWidth = '100%';
    expect(buttonEl.getAttribute('formatter-width')).toEqual('100%');
    buttonEl.formatterWidth = 'test';
    expect(buttonEl.getAttribute('formatter-width')).toEqual(null);
  });

  it('can set/get data of menu', () => {
    const menuGroupHTML = `
      <ids-menu-group select="multiple">
        <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
        <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
        <ids-menu-item id="item3" value="3" selected="true">Item 3</ids-menu-item>
      </ids-menu-group>
    `;
    menuEl.insertAdjacentHTML('afterbegin', menuGroupHTML);

    // check default values
    const initialExpected = ['3'];
    let menuValues = menuEl.getSelectedValues();
    expect(menuValues.length).toBe(1);
    expect(menuValues).toEqual(initialExpected);

    // set new values from button
    const expected = ['1', '3'];
    buttonEl.value = expected;

    // check value getter in button and menu match
    const buttonValues = buttonEl.value;
    menuValues = menuEl.getSelectedValues();
    expect(menuValues.length).toBe(2);
    expect(menuValues).toEqual(expected);
    expect(buttonValues).toEqual(menuValues);
  });
});
