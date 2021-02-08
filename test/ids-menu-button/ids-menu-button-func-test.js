/**
 * @jest-environment jsdom
 */
import IdsMenuButton from '../../src/ids-menu-button/ids-menu-button';
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/ids-popup-menu/ids-popup-menu';

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

  it('shows/hides the menu when the button is clicked', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });
    buttonEl.dispatchEvent(clickEvent);

    setTimeout(() => {
      expect(menuEl.popup.visible).toBeTruthy();
      done();
    }, 20);
  });
});
