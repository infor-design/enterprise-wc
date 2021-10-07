/**
 * @jest-environment jsdom
 */
// eslint-disable-next-line
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import IdsTabs, { IdsTab, IdsTabsContext, IdsTabContent } from '../../src/components/ids-tabs';
import IdsHeader from '../../src/components/ids-header';
import IdsText from '../../src/components/ids-text/ids-text';
import createFromTemplate from '../helpers/create-from-template';

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

const DEFAULT_TABS_HTML = (
  `<ids-tabs value="hello">
    <ids-tab value="hello">Hello</ids-tab>
    <ids-tab value="world">World</ids-tab>
    <ids-tab value="can">Can</ids-tab>
    <ids-tab value="uhearme">You Hear Me?</ids-tab>
  </ids-tabs>`
);

const TAB_CONTEXT_HTML = (
  `<ids-tabs-context>
    <ids-tabs value="a">
      <ids-tab value="a"></ids-tab>
      <ids-tab value="b"></ids-tab>
      <ids-tab value="c"></ids-tab>
    </ids-tabs>
    <ids-tab-content value="a">A</ids-tab-content>
    <ids-tab-content value="b">B</ids-tab-content>
    <ids-tab-content value="c">C</ids-tab-content>
  </ids-tabs-context>`
);

describe('IdsTabs Tests', () => {
  let elem;

  /**
   * scans through to find all ids-tab elements in an
   * ids-tabs instance and verifies all "selected"
   * attribs make sense based on value of tabs/values
   *
   * @returns {boolean} whether or not there were issues
   */
  function areTabSelectionAttribsValid() {
    let isValidState = true;
    let selectionCount = 0;

    for (const tabEl of [...elem.children]) {
      const isTabSelected = tabEl.value === elem.value;
      const isTabMarkedSelected = Boolean(tabEl.selected);

      if (isTabMarkedSelected) {
        selectionCount++;
      }

      if (isTabMarkedSelected !== isTabSelected) {
        isValidState = false;
      }
    }

    if (selectionCount > 1 || selectionCount === 0) {
      isValidState = false;
    }

    return isValidState;
  }

  afterEach(async () => {
    elem?.remove();
  });

  it('renders from HTML Template with no errors', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('Does not show errors when created with no tabs', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, '<ids-tabs></ids-tabs>');

    expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders a vertical set of tabs with no errors', async () => {
    elem = await createFromTemplate(
      elem,
      `<ids-tabs value="hello" orientation="vertical">
        <ids-tab value="hello">Hello</ids-tab>
        <ids-tab value="world">World</ids-tab>
        <ids-tab value="can">Can</ids-tab>
        <ids-tab value="uhearme">You Hear Me?</ids-tab>
      </ids-tabs>`
    );

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('creates tabs with vertical orientation, then sets them horizontal', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(
      elem,
      `<ids-tabs value="hello" orientation="vertical">
        <ids-tab value="hello">Hello</ids-tab>
        <ids-tab value="world">World</ids-tab>
        <ids-tab value="can">Can</ids-tab>
        <ids-tab value="uhearme">You Hear Me?</ids-tab>
      </ids-tabs>`
    );

    elem.orientation = 'horizontal';
    await processAnimFrame();

    expect(elem.getAttribute('orientation')).toEqual('horizontal');
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);

    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders with counts, and has no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createFromTemplate(
      elem,
      `<ids-tabs>
        <ids-tab count="20">Pizzas</ids-tab>
        <ids-tab count="18">Diet Cokes</ids-tab>
        <ids-tab count="12">Ginger Ales</ids-tab>
      </ids-tabs>`
    );
    expect(elem.outerHTML).toMatchSnapshot();
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders tab dividers on counts, and has no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createFromTemplate(
      elem,
      `<ids-tabs>
        <ids-tab count="20">Pizzas</ids-tab>
        <ids-tab count="18">Diet Cokes</ids-tab>
        <ids-tab-divider></ids-tab-divider>
       <ids-tab count="12">Ginger Ales</ids-tab>
      </ids-tabs>`
    );
    expect(elem.outerHTML).toMatchSnapshot();
    expect(errors).not.toHaveBeenCalled();
    expect(elem.querySelector('ids-tab-divider').getAttribute('role')).toEqual('presentation');
  });

  it('renders with partial counts set, and triggers no error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    await createFromTemplate(
      elem,
      `<ids-tabs>
        <ids-tab count="20">Pizzas</ids-tab>
        <ids-tab count="18">Diet Cokes</ids-tab>
        <ids-tab>Ginger Ales</ids-tab>
      </ids-tabs>`
    );

    expect(errors).not.toHaveBeenCalled();
  });

  it('removes a tab after rendering and does not break', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    elem.remove(elem.children[elem.children.length - 1]);
    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets "selected" state of a new tab directly, and does not '
  + 'become in an invalid tabs state', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);

    elem.children[1].selected = true;
    await processAnimFrame();
    // const hasValidTabs = areTabSelectionAttribsValid(elem);

    // expect(hasValidTabs).toEqual(true);
  });

  it('unsets "selected" state of a selected tab false, and triggers '
  + 'an error with an invalid tabs state', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    elem.children[0].selected = false;
    await processAnimFrame();
    const hasValidTabs = areTabSelectionAttribsValid(elem);

    expect(hasValidTabs).toEqual(false);
  });

  it('sets tabs to an invalid value, and is reset to the first tab value available', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    elem.value = 'random_value';
    await processAnimFrame();

    const hasValidTabs = areTabSelectionAttribsValid(elem);

    expect(hasValidTabs).toEqual(true);
    expect(errors).not.toHaveBeenCalled();
  });

  it('changes content within a text node to fire a slotchange with no errors', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    const errors = jest.spyOn(global.console, 'error');
    elem.children[0].textContent = 'Its Over 9000';

    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('changes value of ids-tab, and the "selected" attrib of every '
  + 'ids-tab listed is predictable', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    await Promise.all([...elem.children].map((tabEl) => async () => {
      elem.value = tabEl.getAttribute('value');
      await processAnimFrame();
      const isTabSelectionValid = areTabSelectionAttribsValid();
      expect(isTabSelectionValid).toEqual(true);
      expect(elem.outerHTML).toMatchSnapshot();
    }));
  });

  it('changes calls value setter of ids-tab to it\'s current value without side effects', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    elem.value = 'world';
  });

  it('assigns an invalid count to a tab with counts, and triggers '
  + 'an error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    await expect(createFromTemplate(
      elem,
      `<ids-tabs value="eggs">
        <ids-tab count="z20" value="eggs">Eggs In a Basket</ids-tab>
        <ids-tab count="5" value="peas">Peas in a Pod</ids-tab>
      </ids-tabs>`
    ));

    expect(errors).not.toHaveBeenCalled();
  });

  it('sets count attribute on the ids-tab component predictably', async () => {
    elem = await createFromTemplate(
      elem,
      `<ids-tab count="20" value="eggs">Eggs In a Basket</ids-tab>`
    );

    expect(elem.getAttribute('count')).toEqual('20');

    elem.count = '';
    await processAnimFrame();
    expect(elem.hasAttribute('count')).toEqual(false);

    elem.count = '20';
    expect(elem.getAttribute('count')).toEqual('20');

    elem.count = 'z20z';
    expect(elem.getAttribute('count')).toEqual('20');
  });

  it('is created within ids-header and gets set to an alternate color variant', async () => {
    const idsHeader = new IdsHeader();
    document.body.appendChild(idsHeader);

    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML, idsHeader);
  });

  it('predictably sets/gets color-variant', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    expectEnumAttributeBehavior({
      elem,
      attribute: 'color-variant',
      values: ['alternate']
    });

    elem.colorVariant = 'random';
    expect(elem.hasAttribute('color-variant')).toBeFalsy();
    expect(elem.hasAttribute('color-variant')).toBeFalsy();
  });

  it('clicks on an unselected tab and ids-tabs detects tabselect', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);

    const clickEvent = new MouseEvent('click', {
      target: elem.children[1],
      bubbles: true,
      cancelable: true,
      view: window
    });
    elem.children[1].dispatchEvent(clickEvent);
  });

  it('sets/gets the selected flag predictably on ids-tab', async () => {
    elem = await createFromTemplate(elem, '<ids-tab value="random"></ids-tab>');

    await expectFlagAttributeBehavior({ elem, attribute: 'selected' });
  });

  it('sets/gets the color-variant flag predictably on ids-tab', async () => {
    elem = await createFromTemplate(elem, '<ids-tab value="random"></ids-tab>');
    expectEnumAttributeBehavior({
      elem,
      attribute: 'color-variant',
      values: ['alternate'],
    });

    elem.colorVariant = 'random';
    expect(elem.hasAttribute('color-variant')).toBeFalsy();
  });

  it('gets/sets the value of ids-tabs-context reliably', async () => {
    elem = await createFromTemplate(elem, TAB_CONTEXT_HTML);
    expectEnumAttributeBehavior({
      elem,
      attribute: 'value',
      values: ['a', 'b', 'c']
    });

    elem.colorVariant = 'random';
    expect(elem.hasAttribute('color-variant')).toBeFalsy();
  });

  it('gets/sets the ids-tab-content active flag reliably', async () => {
    elem = await createFromTemplate(elem, TAB_CONTEXT_HTML);
    const contentElem = elem.querySelector('ids-tab-content');

    expectFlagAttributeBehavior({
      elem: contentElem,
      attribute: 'active'
    });
  });

  it('sets the ids-tab-content value directly', async () => {
    elem = await createFromTemplate(elem, TAB_CONTEXT_HTML);
    const contentElem = elem.querySelector('ids-tab-content');
    expect(contentElem.getAttribute('value')).toEqual('a');

    contentElem.value = 'b';
    expect(contentElem.getAttribute('value')).toEqual('b');
    expect(contentElem.value).toEqual('b');
  });

  it('sets the aria-label', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    expect(elem.querySelector('ids-tab').getAttribute('aria-label')).toEqual('Hello');
    elem = await createFromTemplate(elem, `<ids-tabs></ids-tabs>`);
    expect(elem.querySelector('ids-tab')).toBeFalsy();
  });

  it('should be able to focus', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    expect(elem.querySelector('ids-tab').getAttribute('aria-label')).toEqual('Hello');
    elem = await createFromTemplate(elem, `<ids-tabs></ids-tabs>`);
    expect(elem.querySelector('ids-tab')).toBeFalsy();
    expect(elem.getFocusedTabIndex()).toEqual(-1);
  });
});
