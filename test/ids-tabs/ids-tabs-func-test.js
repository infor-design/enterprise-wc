/**
 * @jest-environment jsdom
 */
import IdsTabs, { IdsTab } from '../../src/ids-tabs';
import IdsText from '../../src/ids-text/ids-text';

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => resolve());
});

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

      expect(isTabMarkedSelected).toEqual(isTabSelected);
      if (isTabMarkedSelected !== isTabSelected) {
        isValidState = false;
      }
    }

    if (selectionCount > 1) {
      isValidState = false;
    }

    return isValidState;
  }

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    await processAnimFrame();

    return elem;
  };

  beforeEach(async () => {
    elem = await createElemViaTemplate(
      `<ids-tabs value="hello">
        <ids-tab value="hello">Hello</ids-tab>
        <ids-tab value="world">World</ids-tab>
        <ids-tab value="can">Can</ids-tab>
        <ids-tab value="uhearme">You Hear Me?</ids-tab>
      </ids-tabs>`
    );

    await processAnimFrame();
  });

  afterAll(() => {
    window.close();
  });

  it('renders from HTML Template with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders with counts, and has no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      `<ids-tabs>
        <ids-tab count="20">Pizzas</ids-tab>
        <ids-tab count="18">Diet Cokes</ids-tab>
        <ids-tab count="12">Ginger Ales</ids-tab>
      </ids-tabs>`
    );
    expect(elem.outerHTML).toMatchSnapshot();
    expect(errors).not.toHaveBeenCalled();
  });

  /*
  it('renders with partial counts set, and triggers an error', async () => {
    await expect(Promise.all([
      await createElemViaTemplate(
        `<ids-tabs>
          <ids-tab count="20">Pizzas</ids-tab>
          <ids-tab count="18">Diet Cokes</ids-tab>
          <ids-tab>Ginger Ales?</ids-tab>
        </ids-tabs>`
      ),
    ])).rejects.toThrow();
  });
  */

  it('removes a tab after rendering and does not break', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove(elem.children[elem.children.length - 1]);
    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets "selected" state of a tab directly, and does not '
  + 'trigger an error', async () => {
    elem.children[1].selected = true;

    await processAnimFrame();
    const hasValidTabs = await areTabSelectionAttribsValid(elem);

    expect(hasValidTabs).toEqual(true);
  });

  it('changes content within a text node to fire a slotchange with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.children[0].textContent = 'Its Over 9000';

    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('changes value of ids-tab, and the "selected" attrib of every '
  + 'ids-tab listed is predictable', async () => {
    await Promise.all([...elem.children].map((tabEl) => async () => {
      elem.value = tabEl.getAttribute('value');
      await processAnimFrame();
      const isTabSelectionValid = await areTabSelectionAttribsValid();
      expect(isTabSelectionValid).toEqual(true);
      expect(elem.outerHTML).toMatchSnapshot();
    }));
  });
});
