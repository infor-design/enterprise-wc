/**
 * @jest-environment jsdom
 */
import IdsDrawer from '../../src/components/ids-drawer/ids-drawer';
import IdsContainer from '../../src/components/ids-container/ids-container';
import '../../src/components/ids-button/ids-button';

import createFromTemplate from '../helpers/create-from-template';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import waitForTimeout from '../helpers/wait-for-timeout';
import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';
import IdsLocale from '../../src/components/ids-locale/ids-locale';

describe('IdsDrawer Component', () => {
  let elem: any;
  let locale: IdsLocale;

  afterEach(async () => {
    locale = IdsGlobal.getLocale();
    document.body.innerHTML = '';
  });

  test('must have an edge', async () => {
    elem = createFromTemplate(
      elem,
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );
    elem.edge = 'start';

    expect(elem.container.classList.contains('edge-start')).toBeTruthy();

    elem.edge = 'bottom';

    expect(elem.container.classList.contains('edge-start')).toBeFalsy();
    expect(elem.container.classList.contains('edge-bottom')).toBeTruthy();

    // Can't set junk values
    elem.edge = 'junk';

    expect(elem.container.classList.contains('edge-junk')).toBeFalsy();
  });

  test('can have a type', async () => {
    elem = createFromTemplate(elem, `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`);
    await expectEnumAttributeBehavior({
      elem,
      attribute: 'type',
      values: ['app-menu', 'action-sheet'],
      defaultValue: null
    });
  });

  test('can have a target', async () => {
    // Build drawer/target and connect them
    elem = createFromTemplate(
      elem,
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );
    let btn: any;
    // eslint-disable-next-line prefer-const
    btn = createFromTemplate(
      btn,
      `<ids-button id="trigger-btn">Open Drawer</ids-button>`
    );
    elem.target = btn;
    expect(elem.state.target.isEqualNode(btn)).toBeTruthy();

    // Click the target to open the drawer
    btn.click();
    await waitForTimeout(() => expect(elem.visible).toBeTruthy());
    elem.hide();

    // Disconnect the drawer from the button
    elem.target = null;
    expect(elem.state.target).toBe(null);

    // Click the target again.  It shouldn't open the drawer
    btn.click();
    await waitForTimeout(() => expect(elem.visible).toBeFalsy());

    // Try setting to null a second time (addresses coverage)
    elem.target = null;
  });

  test('can be prevented from being shown', async () => {
    elem = createFromTemplate(
      elem,
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );

    // Veto the opening of the Drawer
    elem.addEventListener('beforeshow', (e: any) => {
      e.detail.response(false);
    });
    elem.show();

    expect(elem.visible).toBeFalsy();
  });

  test('can be prevented from being hidden', async () => {
    elem = createFromTemplate(
      elem,
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );

    // Veto the closing of the Drawer
    elem.addEventListener('beforehide', (e: any) => {
      e.detail.response(false);
    });
    elem.show();
    await waitForTimeout(() => expect(elem.visible).toBeTruthy());
    elem.hide();

    expect(elem.visible).toBeTruthy();
  });

  test('should update with container language change', async () => {
    const elem2: any = new IdsDrawer();
    const container: any = new IdsContainer();
    document.body.appendChild(container);
    container.appendChild(elem2);
    locale.loadedLanguages.set('ar', arMessages);

    await IdsGlobal.getLocale().setLanguage('ar');
    waitForTimeout(() => expect(elem.getAttribute('dir')).toBe('rtl'));
  });

  test('should call hide on outside click', async () => {
    elem = createFromTemplate(
      elem,
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );
    elem.show();
    const spy = jest.spyOn(elem, 'hide');
    elem.onOutsideClick({ target: document.body });

    expect(spy).toHaveBeenCalled();
    expect(elem.visible).toBe(false);

    elem.show();
    elem.onOutsideClick({ target: elem });

    expect(elem.visible).toBe(true);
  });
});
