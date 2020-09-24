/**
 * @jest-environment jsdom
 */
import IdsPopup from '../../src/ids-popup/ids-popup';

describe('IdsPopup Component', () => {
  let popup;
  let contentElem;

  beforeEach(async () => {
    // Create Popup w/ basic dimensions
    popup = new IdsPopup();
    popup.style.width = '100px';
    popup.style.height = '100px';

    // Create content slot
    contentElem = document.createElement('div');
    contentElem.setAttribute('slot', 'content');
    contentElem.textContent = 'My Popup';
    popup.appendChild(contentElem);

    // Add to DOM
    document.body.appendChild(popup);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    popup = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-popup').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be removed from the DOM with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    popup.remove();

    expect(document.querySelectorAll('ids-popup').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has default settings', () => {
    const x = popup.x;
    const y = popup.y;
    const alignX = popup.alignX;
    const alignY = popup.alignY;
    const edge = popup.alignEdge;
    const target = popup.alignTarget;
    const animated = popup.animated;
    const visible = popup.visible;

    expect(x).toEqual(0);
    expect(y).toEqual(0);
    expect(edge).toEqual('center');
    expect(alignX).toEqual('center');
    expect(alignY).toEqual('center');
    expect(target).not.toBeDefined();
    expect(animated).toBeDefined();
    expect(animated).toBeFalsy();
    expect(visible).toBeDefined();
    expect(visible).toBeFalsy();
  });

  it('has access to globals', () => {
    expect(this.ro instanceof ResizeObserver).toBeTruthy();
    expect(this.mo instanceof MutationObserver).toBeTruthy();
  });

  // NOTE: Needs to mock `getBoundingClientRect` on the `container`
  it('can align based on coordinates', () => {
    const c = popup.container;
    const originalGetBoundingClientRect = c.getBoundingClientRect;

    // Basic coord alignment (center/center against the point, for modals)
    c.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100
    }));
    popup.x = 0;
    popup.y = 0;

    expect(popup.container.style.left).toEqual('-50px');
    expect(popup.container.style.top).toEqual('-50px');

    // Left/Top (standard for context menus)
    popup.alignX = 'left';
    popup.alignY = 'top';

    expect(popup.container.style.left).toEqual('0px');
    expect(popup.container.style.top).toEqual('0px');

    // Bottom/Right (left/top edges will be at X:-100,y:-100)
    popup.alignX = 'right';
    popup.alignY = 'bottom';

    expect(popup.container.style.left).toEqual('-100px');
    expect(popup.container.style.top).toEqual('-100px');

    // Center (popup will center itself at X:0,Y:0)
    popup.alignX = 'center';
    popup.alignY = 'center';

    expect(popup.container.style.left).toEqual('-50px');
    expect(popup.container.style.top).toEqual('-50px');

    // Left/Top (shorthand)
    popup.align = 'left, top';

    expect(popup.container.style.left).toEqual('0px');
    expect(popup.container.style.top).toEqual('0px');

    // Bottom/Right (shorthand)
    popup.align = 'right, bottom';

    expect(popup.container.style.left).toEqual('-100px');
    expect(popup.container.style.top).toEqual('-100px');

    // Center (shorthand)
    popup.align = 'center';

    expect(popup.container.style.left).toEqual('-50px');
    expect(popup.container.style.top).toEqual('-50px');

    // Reset `getBoundingClientRect` to default
    c.getBoundingClientRect = originalGetBoundingClientRect;
  });

  // NOTE: Needs to mock `getBoundingClientRect` on both the `container` and the `alignTarget`
  it('can align relative to another element on the page', () => {
    const c = popup.container;
    const originalCGetBoundingClientRect = c.getBoundingClientRect;

    // Create/Set the alignment target
    const alignTargetContainer = document.createElement('div');
    alignTargetContainer.style.position = 'relative';
    const a = document.createElement('div');
    a.id = 'test-align-target';
    a.style.position = 'absolute';
    a.style.height = '50px';
    a.style.left = '300px';
    a.style.top = '300px';
    a.style.width = '50px';
    alignTargetContainer.appendChild(a);
    document.body.appendChild(alignTargetContainer);

    // Mock `getBoundingClientRect` for the alignTarget
    const originalAGetBoundingClientRect = a.getBoundingClientRect;
    a.getBoundingClientRect = jest.fn(() => ({
      x: 300,
      y: 300,
      width: 50,
      height: 50,
      top: 300,
      right: 350,
      bottom: 350,
      left: 300
    }));

    // Center the component on top of the alignTarget
    // Default `align` attribute is "center"
    c.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100
    }));
    popup.alignTarget = '#test-align-target';
    popup.x = 0;
    popup.y = 0;

    expect(popup.container.style.left).toEqual('275px');
    expect(popup.container.style.top).toEqual('275px');

    // Bottom
    popup.align = 'bottom';

    expect(popup.container.style.left).toEqual('275px');
    expect(popup.container.style.top).toEqual('350px');

    // Use the Y attribute as an offset
    popup.y = 50;

    expect(popup.container.style.left).toEqual('275px');
    expect(popup.container.style.top).toEqual('400px');

    // Reset and test bottom,right alignment
    // (Uses `bottom` as the edge, `right` as secondary border alignment)
    popup.y = 0;
    popup.align = 'bottom, right';

    expect(popup.container.style.left).toEqual('250px');
    expect(popup.container.style.top).toEqual('350px');

    // Switch edge/secondary
    // (Uses `right` as the edge, `bottom` as secondary border alignment)
    popup.align = 'right, bottom';

    expect(popup.container.style.left).toEqual('350px');
    expect(popup.container.style.top).toEqual('250px');

    // Use the X attribute as an offset
    popup.x = 50;

    expect(popup.container.style.left).toEqual('400px');
    expect(popup.container.style.top).toEqual('250px');

    // Add a Y offset for fun
    popup.y = 50;

    expect(popup.container.style.left).toEqual('400px');
    expect(popup.container.style.top).toEqual('300px');

    // Remove the offsets and flip to the opposite alignment
    popup.align = 'top, left';
    popup.x = 0;
    popup.y = 0;

    expect(popup.container.style.left).toEqual('300px');
    expect(popup.container.style.top).toEqual('200px');

    // Switch edge/secondary
    // (Uses `right` as the edge, `bottom` as secondary border alignment)
    popup.align = 'left, top';

    expect(popup.container.style.left).toEqual('200px');
    expect(popup.container.style.top).toEqual('300px');

    // Center vertically, align against the left edge
    // This should autocorrect the `align` attribute to simply say `left`
    popup.align = 'left';

    expect(popup.container.style.left).toEqual('200px');
    expect(popup.container.style.top).toEqual('275px');
  });

  it('should autocorrect some alignment definitions to become their shorthand values', () => {
    const c = popup.container;
    const originalCGetBoundingClientRect = c.getBoundingClientRect;

    // Create/Set the alignment target
    const alignTargetContainer = document.createElement('div');
    alignTargetContainer.style.position = 'relative';
    const a = document.createElement('div');
    a.id = 'test-align-target';
    a.style.position = 'absolute';
    a.style.height = '50px';
    a.style.left = '300px';
    a.style.top = '300px';
    a.style.width = '50px';
    alignTargetContainer.appendChild(a);
    document.body.appendChild(alignTargetContainer);

    // Mock `getBoundingClientRect` for the alignTarget
    const originalAGetBoundingClientRect = a.getBoundingClientRect;
    a.getBoundingClientRect = jest.fn(() => ({
      x: 300,
      y: 300,
      width: 50,
      height: 50,
      top: 300,
      right: 350,
      bottom: 350,
      left: 300
    }));

    // Center the component on top of the alignTarget
    // Default `align` attribute is "center"
    c.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100
    }));
    popup.alignTarget = '#test-align-target';
    popup.x = 0;
    popup.y = 0;

    // Test standard autocorrections
    popup.align = 'center, center';
    expect(popup.getAttribute('align')).toEqual('center');

    popup.align = 'top, center';
    expect(popup.getAttribute('align')).toEqual('top');

    popup.align = 'right, center';
    expect(popup.getAttribute('align')).toEqual('right');

    popup.align = 'left, center';
    expect(popup.getAttribute('align')).toEqual('left');

    popup.align = 'bottom, center';
    expect(popup.getAttribute('align')).toEqual('bottom');

    // Empty/null autocorrects to "center"
    popup.align = '';
    expect(popup.getAttribute('align')).toEqual('center');

    /*
    // Check bad input
    // (should be ignored and values should be retained)
    // @TODO figure out why this doesn't work
    popup.align = 'dude';
    expect(popup.getAttribute('align')).toEqual('center');

    popup.align = 'top, left';
    popup.align = 'dude, dude';
    expect(popup.getAttribute('align')).toEqual('top, left');
    */

    /*
    // If "center" is set as the "edge" and a secondary alignment of "right" or "left" is defined,
    // the secondary alignment should switch to the first.
    // @TODO make this work
    popup.align = 'center, left';
    expect(popup.getAttribute('align')).toEqual('center');

    popup.align = 'center, right';
    expect(popup.getAttribute('align')).toEqual('center');
    */
  });
});
