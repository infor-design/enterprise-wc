/**
 * @jest-environment jsdom
 */
import IdsDrawer from '../../src/components/ids-drawer/ids-drawer';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsButton from '../../src/components/ids-button/ids-button';

import elemBuilderFactory from '../helpers/elem-builder-factory';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import waitFor from '../helpers/wait-for';
import processAnimFrame from '../helpers/process-anim-frame';

const elemBuilder = elemBuilderFactory();

describe('IdsDrawer Component', () => {
  afterAll(async () => { elemBuilder.clearElement(); });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    // Build and destroy an "App Menu" type Drawer
    await elemBuilder.createElemFromTemplate(
      `<ids-drawer edge="start" type="app-menu">
        <div>Menu Content</div>
      </ids-drawer>`
    );
    await elemBuilder.clearElement();

    // Build and destroy an "Action Sheet" type Drawer
    await elemBuilder.createElemFromTemplate(
      `<ids-drawer edge="bottom" type="action-sheet">
        <div>Action Sheet Content</div>
      </ids-drawer>`
    );
    await elemBuilder.clearElement();

    expect(errors).not.toHaveBeenCalled();
  });

  it('must have an edge', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
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

  it('can have a type', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );
    await expectEnumAttributeBehavior({
      elem,
      attribute: 'type',
      values: ['app-menu', 'action-sheet'],
      defaultValue: null
    });
  });

  it('can have a target', async () => {
    // Build drawer/target and connect them
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );
    const btn = await elemBuilder.createElemFromTemplate(
      `<ids-button id="trigger-btn">Open Drawer</ids-button>`
    );
    elem.target = btn;
    expect(elem.state.target.isEqualNode(btn)).toBeTruthy();

    // Click the target to open the drawer
    btn.click();
    await () => expect(elem.visible).toBeTruthy());
    elem.hide();

    // Disconnect the drawer from the button
    elem.target = null;
    expect(elem.state.target).toBe(null);

    // Click the target again.  It shouldn't open the drawer
    btn.click();
    await waitFor(() => expect(elem.visible).toBeFalsy());

    // Try setting to null a second time (addresses coverage)
    elem.target = null;
  });

  it('can be prevented from being shown', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );

    // Veto the opening of the Drawer
    elem.addEventListener('beforeshow', (e) => {
      e.detail.response(false);
    });
    elem.show();

    expect(elem.visible).toBeFalsy();
  });

  it('can be prevented from being hidden', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-drawer>
        <div>Content</div>
      </ids-drawer>`
    );

    // Veto the closing of the Drawer
    elem.addEventListener('beforehide', (e) => {
      e.detail.response(false);
    });
    elem.show();
    await waitFor(() => expect(elem.visible).toBeTruthy());
    elem.hide();

    expect(elem.visible).toBeTruthy();
  });

  it('should update with container language change', async () => {
    const elem = new IdsDrawer();
    const container = new IdsContainer();
    document.body.appendChild(container);
    container.appendChild(elem);

    await container.setLanguage('ar');
    await processAnimFrame();
    expect(elem.getAttribute('dir')).toEqual('rtl');
  });

  it('should call hide on outside click', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
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
