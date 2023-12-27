/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../../src/components/ids-tabs/ids-tabs';
import '../../src/components/ids-tabs/ids-tab';
import '../../src/components/ids-tabs/ids-tabs-context';
import '../../src/components/ids-tabs/ids-tab-content';

import IdsHeader from '../../src/components/ids-header/ids-header';
import '../../src/components/ids-swappable/ids-swappable';
import '../../src/components/ids-text/ids-text';

const DEFAULT_TABS_HTML = (
  `<ids-tabs>
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

const TAB_SWAPPABLE_HTML = (
  `<ids-tabs>
    <ids-swappable dropzone="move">
      <ids-swappable-item drag-mode="always">
        <ids-tab value="contracts">Contracts</ids-tab>
      </ids-swappable-item>
      <ids-swappable-item drag-mode="always">
        <ids-tab value="opportunities">Opportunities</ids-tab>
      </ids-swappable-item>
      <ids-swappable-item drag-mode="always">
        <ids-tab value="attachments" disabled>Attachments</ids-tab>
      </ids-swappable-item>
      <ids-swappable-item drag-mode="always">
        <ids-tab value="notes">Notes</ids-tab>
      </ids-swappable-item>
    </ids-swappable>
  </ids-tabs>`
);

describe('IdsTabs Tests', () => {
  let elem: any;

  /**
   * scans through to find all ids-tab elements in an
   * ids-tabs instance and verifies all "selected"
   * attribs make sense based on value of tabs/values
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

  it('removes a tab after rendering and does not break', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    await processAnimFrame();

    elem.remove(elem.children[elem.children.length - 1]);
    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  // @TODO Re-enable after reviewing behavior of this test #683
  it.skip('sets "selected" state of a new tab directly, and does not become in an invalid tabs state', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    elem.children[1].selected = true;
    await processAnimFrame();
    const hasValidTabs = areTabSelectionAttribsValid();
    expect(hasValidTabs).toEqual(true);
  });

  // @TODO Re-enable after reviewing behavior of this test #683
  it.skip('unsets "selected" state of a selected tab false, and triggers an error with an invalid tabs state', async () => {
    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
    elem.children[0].selected = false;
    await processAnimFrame();
    const hasValidTabs = areTabSelectionAttribsValid();
    expect(hasValidTabs).toEqual(false);
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

  it('changes value of ids-tab, and the "selected" attrib of every ids-tab listed is predictable', async () => {
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

  it('sets count attribute on the ids-tab component predictably', async () => {
    elem = await createFromTemplate(
      elem,
      `<ids-tab count="20" value="eggs">Eggs In a Basket</ids-tab>`
    );

    // wait for ids element to fire #updateAttributes() rAF
    await processAnimFrame();

    expect(elem.getAttribute('count')).toEqual('20');

    elem.count = '';
    expect(elem.hasAttribute('count')).toEqual(false);

    elem.count = '20';
    expect(elem.getAttribute('count')).toEqual('20');

    elem.count = 'z20z';
    expect(elem.getAttribute('count')).toEqual('20');
  });

  it('is created within ids-header and gets set to an alternate color variant', async () => {
    const idsHeader = new IdsHeader();
    (document.body as any).appendChild(idsHeader);

    elem = await createFromTemplate(elem, DEFAULT_TABS_HTML);
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
    const args: any = {
      target: elem.children[1],
      bubbles: true,
      cancelable: true,
      view: window
    };
    const clickEvent = new MouseEvent('click', args);
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
});
