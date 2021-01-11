/**
 * @jest-environment jsdom
 */
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/ids-popup-menu/ids-popup-menu';

describe('IdsPopupMenu Component', () => {
  let menu;
  let group1;
  let header;
  let item1;
  let item2;
  let item3;
  let sep;
  let group2;
  let item4;
  let item5;

  beforeEach(async () => {
    menu = new IdsPopupMenu();
    group1 = new IdsMenuGroup();
    group1.id = 'primary';
    header = new IdsMenuHeader();
    item1 = new IdsMenuItem();
    item1.value = '1';
    item2 = new IdsMenuItem();
    item2.value = '2';
    item3 = new IdsMenuItem();
    item3.value = '3';
    sep = new IdsSeparator();
    group2 = new IdsMenuGroup();
    group2.id = 'secondary';
    item4 = new IdsMenuItem();
    item4.value = '4';
    item5 = new IdsMenuItem();
    item5.value = '5';

    // Add to DOM
    group1.appendChild(header);
    group1.appendChild(item1);
    group1.appendChild(item2);
    group1.appendChild(item3);
    group2.appendChild(item4);
    group2.appendChild(item5);
    menu.appendChild(group1);
    menu.appendChild(sep);
    menu.appendChild(group2);
    document.body.appendChild(menu);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
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

  it('can explain when document click events are attached', (done) => {
    menu.show();

    setTimeout(() => {
      expect(menu.hasOpenEvents).toBeTruthy();

      menu.hide();
      setTimeout(() => {
        expect(menu.hasOpenEvents).toBeFalsy();
        done();
      }, 10);
    }, 10);
  });
});
