/**
 * @jest-environment jsdom
 */
// eslint-disable-next-line
import processAnimFrame from '../helpers/process-anim-frame';
import '../helpers/resize-observer-mock';
import '../../src/components/ids-input/ids-input';
import '../../src/components/ids-pager/ids-pager';
import IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

const HTMLSnippets = {
  NAV_BUTTONS_WITHOUT_NESTING: (
    `<ids-pager page-size="20" page-number="10" total="200">
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
    </ids-pager>`
  ),
  NAV_BUTTONS_WITH_TOOLTIPS: (
    `<ids-pager page-size="20" page-number="10" total="200">
      <ids-pager-button first tooltip="First"></ids-pager-button>
      <ids-pager-button previous tooltip="Previous"></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next tooltip="Next"></ids-pager-button>
      <ids-pager-button last tooltip="Last"></ids-pager-button>
    </ids-pager>`
  ),
  NAV_BUTTONS_AND_INPUT: (
    `<ids-pager page-size="20" page-number="10" total="200">
      <section>
        <ids-pager-button first></ids-pager-button>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-input></ids-pager-input>
        <ids-pager-button next></ids-pager-button>
        <ids-pager-button last></ids-pager-button>
      </section>
    </ids-pager>`
  ),
  NUMBER_LIST: (
    `<ids-pager type="list" step="0" page-size="20" page-number="10" total="500">
    </ids-pager>`
  ),
  NUMBER_LIST_NAV: (
    `<ids-pager page-size="20" page-number="10" total="150">
      <section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </section>
  </ids-pager>`
  ),
  RIGHT_ALIGNED_CONTENT: (
    `<ids-pager page-size="20" page-number="10" total="150">
      <section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </section>
      <section slot="end">
        Right-Aligned Content
      </section>
    </ids-pager>`
  ),
  DOUBLE_SIDED_CONTENT: (
    `<ids-pager page-size="20" page-number="10" total="150">
      <section slot="start">
        Left-Aligned-Content
      </section>
      <section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </section>
      <section slot="end">
        Right-Aligned-Content
      </section>
    </ids-pager>`
  ),
  DROPDOWN_CONTENT: (
    `<ids-pager page-number="1" page-size="10" total="200" id="ids-pager-example">
      <ids-pager-dropdown slot="start" label="test1"></ids-pager-dropdown>
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
      <ids-pager-dropdown slot="end" label="test2"></ids-pager-dropdown>
    </ids-pager>`
  )
};

describe('IdsPager Component', () => {
  let elem: any;

  const createElemViaTemplate = async (innerHTML: any) => {
    elem?.remove?.();
    IdsGlobal.getLocale().loadedLanguages.set('de', deMessages);

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    await processAnimFrame();

    return elem;
  };

  afterEach(async () => {
    elem?.remove();
  });

  // ---------------- //
  // ids-pager tests //
  // =============== //

  it('renders from HTML Template with nav buttons with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);

    elem.remove();

    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_WITHOUT_NESTING);
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders from HTML Template with number list navigation with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NUMBER_LIST_NAV);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set label text for button and number list', async () => {
    const el = await createElemViaTemplate(HTMLSnippets.NUMBER_LIST_NAV);
    const btn = el.querySelector('ids-pager-button');
    const listEl = el.querySelector('ids-pager-number-list');
    const defaultListLabel = 'Go to page {num} of {total}';

    expect(btn.label).toEqual(null);
    expect(btn.getAttribute('label')).toEqual(null);
    expect(listEl.label).toEqual(defaultListLabel);
    expect(listEl.getAttribute('label')).toEqual(null);
    btn.setAttribute('label', 'test');
    listEl.setAttribute('label', 'test2');

    expect(btn.label).toEqual('test');
    expect(btn.getAttribute('label')).toEqual('test');
    expect(listEl.label).toEqual('test2');
    expect(listEl.getAttribute('label')).toEqual('test2');
    btn.removeAttribute('label');
    listEl.removeAttribute('label');

    expect(btn.label).toEqual(null);
    expect(btn.getAttribute('label')).toEqual(null);
    expect(listEl.label).toEqual(defaultListLabel);
    expect(listEl.getAttribute('label')).toEqual(null);
  });

  it('should set the number of step on page number list', async () => {
    const el = await createElemViaTemplate(HTMLSnippets.NUMBER_LIST_NAV);
    const listEl = el.querySelector('ids-pager-number-list');
    const defaultStep = 3;

    expect(listEl.step).toEqual(defaultStep);
    expect(listEl.getAttribute('step')).toEqual(String(defaultStep));
    el.setAttribute('step', '2');

    expect(listEl.step).toEqual(2);
    expect(listEl.getAttribute('step')).toEqual('2');
    el.setAttribute('step', '-1');

    expect(listEl.step).toEqual(-1);
    expect(listEl.getAttribute('step')).toEqual('-1');
    el.removeAttribute('step');

    expect(listEl.step).toEqual(defaultStep);
    expect(listEl.getAttribute('step')).toEqual(String(defaultStep));
    el.setAttribute('step', 'test');

    expect(listEl.step).toEqual(defaultStep);
    expect(listEl.getAttribute('step')).toEqual(String(defaultStep));
  });

  it('shows tooltip-popup when IdsPagerButton.tooltip is not empty', async () => {
    const pager = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_WITH_TOOLTIPS);
    const [first, previous, next, last] = pager.querySelectorAll('ids-pager-button');
    expect(first.tooltip).toEqual('First');
    expect(previous.tooltip).toEqual('Previous');
    expect(next.tooltip).toEqual('Next');
    expect(last.tooltip).toEqual('Last');

    expect(first.getAttribute('tooltip')).toEqual('First');
    expect(previous.getAttribute('tooltip')).toEqual('Previous');
    expect(next.getAttribute('tooltip')).toEqual('Next');
    expect(last.getAttribute('tooltip')).toEqual('Last');

    let tooltipElement = document.querySelector('ids-tooltip') as any as IdsTooltip;
    expect(tooltipElement).toBeFalsy();

    first.showTooltip();
    tooltipElement = document.querySelector('ids-tooltip') as any as IdsTooltip;
    expect(tooltipElement?.visible).toEqual(true);
    expect(tooltipElement?.textContent).toEqual('First');
  });

  it('hides tooltip-popup when IdsPagerButton.tooltip is empty', async () => {
    // const pager = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_WITH_TOOLTIPS);
    // const [first, previous, next, last] = pager.querySelectorAll('ids-pager-button');
    // expect(first.tooltip).toEqual('First');
    // expect(previous.tooltip).toEqual('Previous');
    // expect(next.tooltip).toEqual('Next');
    // expect(last.tooltip).toEqual('Last');

    // expect(first.getAttribute('tooltip')).toEqual('First');
    // expect(previous.getAttribute('tooltip')).toEqual('Previous');
    // expect(next.getAttribute('tooltip')).toEqual('Next');
    // expect(last.getAttribute('tooltip')).toEqual('Last');

    // const tooltip = first.querySelector('ids-tooltip');
    // expect(tooltip.visible).toEqual(false);

    // first.showTooltip();
    // expect(tooltip.visible).toEqual(true);
    // expect(tooltip.textContent).toEqual('First');
  });

  it('has slots: start, middle, end', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.DOUBLE_SIDED_CONTENT);
    const { slots } = elem.elements;
    expect(slots.start).toBeDefined();
    expect(slots.middle).toBeDefined();
    expect(slots.end).toBeDefined();
  });

  it('renders with content on both sides with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.DOUBLE_SIDED_CONTENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with content on right side with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.RIGHT_ALIGNED_CONTENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('sets the ids-pager page-number to invalid values and it gets reset to 1', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('page-number', 'z35');
    expect(elem.pageNumber).toEqual(1);

    elem.setAttribute('page-number', '-1');
    expect(elem.pageNumber).toEqual(1);
  });

  it('sets the ids-pager page-size to invalid values and it gets reset to 1', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('page-size', 'z35');
    expect(elem.pageSize).toEqual(10);

    elem.setAttribute('page-size', '-1');
    expect(elem.pageSize).toEqual(10);
  });

  it('can set disabled on ids-pager predictably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager page-number="1" page-size="10" total="100" disabled></ids-pager>'
    );
    expect(elem.disabled).toEqual(true);

    elem.setAttribute('disabled', false);
    expect(elem.disabled).toEqual(false);

    elem.disabled = true;
    expect(elem.disabled).toEqual(true);

    elem.disabled = false;
    elem.setAttribute('disabled', false);

    elem.setAttribute('disabled', true);
    expect(elem.disabled).toEqual(true);

    elem.disabled = false;
    expect(elem.disabled).toEqual(false);

    elem.disabled = true;
    expect(elem.disabled).toEqual(true);
  });

  it('sets the list type', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NUMBER_LIST);
    expect(elem.type).toEqual('list');
  });

  it('sets the dropdowns', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.DROPDOWN_CONTENT);
    expect(elem.elements.dropdowns.length).toEqual(2);
  });

  it('sets the ids-pager page-number above max value and it is limited', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('page-number', '100');
    expect(elem.pageNumber).toEqual(10);
  });

  it('sets the ids-pager total to invalid values and it gets reset to 1', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('total', 'z35');
    expect(elem.total).toEqual(1);

    elem.setAttribute('total', '-1');
    expect(elem.total).toEqual(1);
  });

  it('creates a pager and toggles the last button attribute predictably', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const lastNavButton = elem.querySelector('ids-pager-button[last]');
    elem.setAttribute('disabled', true);
    expect(lastNavButton.disabled).toEqual(true);

    elem.disabled = false;
    expect(lastNavButton.hasAttribute('disabled')).toEqual(false);
  });

  it('dispatches a pagenumberchange event and has page number changed', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.dispatchEvent(new CustomEvent('pagenumberchange', {
      bubbles: true,
      detail: { elem: this, value: 2 }
    }));

    expect(elem.pageNumber).toEqual(2);
  });

  // ---------------- //
  // ids-pager-button //
  // =============== //

  it('creates a pager and the "type" of each of its nav button when accessed is based on their flag attrib', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const navButtons = elem.querySelectorAll('ids-pager-button');
    navButtons.forEach((idsPagerButton: any) => {
      expect(idsPagerButton.type).not.toBeFalsy();
      expect(idsPagerButton.hasAttribute(idsPagerButton.type)).not.toBeFalsy();
    });
  });

  it('creates a an ids-pager-button with "first" flag set and nav-disabled works reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" first></ids-pager-button>'
    );
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
    expect(elem.navDisabled).toEqual(true);
    elem.setAttribute('page-number', 5);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeFalsy();
    expect(elem.navDisabled).toEqual(false);
    elem.setAttribute('page-number', 1);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
  });

  it('can set parent-disabled on ids-pager-button predictably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" parent-disabled></ids-pager-button>'
    );
    expect(elem.parentDisabled).toEqual(true);

    elem.setAttribute('parent-disabled', false);
    expect(elem.parentDisabled).toEqual(false);

    elem.setAttribute('parent-disabled', true);
    expect(elem.parentDisabled).toEqual(true);

    elem.parentDisabled = false;
    expect(elem.parentDisabled).toEqual(false);

    elem.parentDisabled = true;
    expect(elem.parentDisabled).toEqual(true);
  });

  it('sets pageNumber to NaN on ids-pager-button and pageNumber resets to 1', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="z" page-size="10" total="100" parent-disabled></ids-pager-button>'
    );
    expect(elem.pageNumber).toEqual(1);
  });

  it('sets the pageSize on ids-pager-button predictably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" parent-disabled></ids-pager-button>'
    );

    elem.setAttribute('page-size', '11');
    expect(elem.pageSize).toEqual(11);

    elem.setAttribute('page-size', 'z100');
    expect(elem.pageSize).toEqual(10);
  });

  it('creates a an ids-pager-button with "previous" flag set and nav-disabled works reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" previous></ids-pager-button>'
    );
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
    elem.setAttribute('page-number', 5);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeFalsy();
    elem.setAttribute('page-number', 1);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
  });

  it('creates a an ids-pager-button with "next" flag set and nav-disabled works reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="10" page-size="10" total="100" next></ids-pager-button>'
    );
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
    elem.setAttribute('page-number', 5);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeFalsy();
    elem.setAttribute('page-number', 10);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
  });

  it('sets "last" flag on ids-pager-button and nav-disabled works reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="10" page-size="10" total="100" last></ids-pager-button>'
    );
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
    elem.setAttribute('page-number', 5);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeFalsy();
    elem.setAttribute('page-number', 10);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
  });

  it('creates ids-pager-button(s) and clicking causes no issues reliably', async () => {
    let pageNumberChangeListener = jest.fn();
    let pageButtonFirstListener = jest.fn();
    let pageButtonPreviousListener = jest.fn();
    let pageButtonNextListener = jest.fn();
    let pageButtonLastListener = jest.fn();

    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="3" page-size="10" total="100" first></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagefirst', pageButtonFirstListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(1);
    expect(pageButtonFirstListener).toBeCalledTimes(1);

    pageNumberChangeListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="2" page-size="10" total="100" previous></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pageprevious', pageButtonPreviousListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(1);
    expect(pageButtonPreviousListener).toBeCalledTimes(1);

    pageNumberChangeListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" next></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagenext', pageButtonNextListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(1);
    expect(pageButtonNextListener).toBeCalledTimes(1);

    pageNumberChangeListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" last></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagelast', pageButtonLastListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(1);
    expect(pageButtonLastListener).toBeCalledTimes(1);

    // clicking first or previous with page-number==1
    // should not dispatch

    pageNumberChangeListener = jest.fn();
    pageButtonFirstListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" first></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagefirst', pageButtonFirstListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
    expect(pageButtonFirstListener).toBeCalledTimes(0);

    pageNumberChangeListener = jest.fn();
    pageButtonPreviousListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" previous></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pageprevious', pageButtonPreviousListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
    expect(pageButtonPreviousListener).toBeCalledTimes(0);

    // clicking next or last with page-number=={{last_page}}
    // should not dispatch

    pageNumberChangeListener = jest.fn();
    pageButtonNextListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="10" page-size="10" total="100" next></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagenext', pageButtonNextListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
    expect(pageButtonNextListener).toBeCalledTimes(0);

    pageNumberChangeListener = jest.fn();
    pageButtonLastListener = jest.fn();
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="10" page-size="10" total="100" last></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagelast', pageButtonLastListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
    expect(pageButtonLastListener).toBeCalledTimes(0);

    // clicking a disabled button should not
    // dispatch events

    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="3" page-size="10" total="100" first disabled></ids-pager-button>'
    );
    elem.addEventListener('pagenumberchange', pageNumberChangeListener);
    elem.addEventListener('pagefirst', pageNumberChangeListener);
    elem.button.dispatchEvent(new Event('click'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
    expect(pageButtonFirstListener).toBeCalledTimes(0);
  });

  it('creates a "first" ids-pager-button, then changes the type to "previous" with no issues', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-button page-number="1" page-size="10" total="100" next></ids-pager-button>'
    );
    elem.setAttribute('previous', '');
    expect(elem.hasAttribute('previous')).toBeTruthy();
  });

  it('updates the input on ids-pager-input and pager pageNumber updates', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const idsPagerInput = elem.querySelector('ids-pager-input');
    idsPagerInput.input.value = '10';
    await processAnimFrame();
    idsPagerInput.input.dispatchEvent(new Event('change', { bubbles: true }));
    await processAnimFrame();

    expect(elem.pageNumber).toEqual(10);
  });

  // --------------------- //
  // ids-pager-number-list //
  // ===================== //

  it('creates ids-pager-number-list and it has the correct number of entries based on page size and total', async () => {
    const pageSize = 10;
    const total = 100;

    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="10" page-size="${pageSize}" total="${total}" last></ids-pager-number-list>`
    );

    const pageCount = Math.ceil(total / pageSize);
    const pageNumberButtons = elem.shadowRoot.querySelectorAll('ids-button');

    expect(pageNumberButtons.length).toEqual(pageCount);
  });

  it('should fire event when clicked on number list button', async () => {
    const pageSize = 10;
    const total = 100;

    const el = await createElemViaTemplate(
      `<ids-pager-number-list page-number="10" step="-1" page-size="${pageSize}" total="${total}"></ids-pager-number-list>`
    );

    const cbClick = jest.fn();
    const cbPageNumberChange = jest.fn();
    el.container.addEventListener('click', cbClick);
    el.addEventListener('click', cbPageNumberChange);

    const pageCount = Math.ceil(total / pageSize);
    const pageNumberButtons = el.shadowRoot.querySelectorAll('ids-button');

    expect(pageNumberButtons.length).toEqual(pageCount);
    pageNumberButtons[0].click();

    expect(cbClick).toBeCalledTimes(1);
    expect(cbPageNumberChange).toBeCalledTimes(1);
  });

  it('creates an ids-pager-input and pageSize can be set and read predictably', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="10" page-size="2" total="100" last></ids-pager-input>`
    );

    expect(elem.pageSize).toEqual(2);

    elem.pageSize = '20';
    expect(elem.pageSize).toEqual(20);
  });

  it('creates a disabled ids-pager-button and parent-disabled can be set and read predictably', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-button page-number="10" page-size="2" total="100" disabled></ids-pager-button>`
    );

    expect(elem.disabled).toEqual(true);
  });

  it('registers an pagenumberchange event predictably on ids-pager-input changes', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="10" page-size="2" total="100" first></ids-pager-input>`
    );

    let pageNumberChangeListener = jest.fn();

    elem.addEventListener('pagenumberchange', pageNumberChangeListener);

    elem.input.input.value = 20;
    elem.input.dispatchEvent(new Event('change'));
    expect(pageNumberChangeListener).toBeCalledTimes(1);

    pageNumberChangeListener = jest.fn();
    elem.input.input.value = 'z22';
    elem.input.dispatchEvent(new Event('change'));
    expect(pageNumberChangeListener).toBeCalledTimes(0);
  });

  it('creates an ids-pager-input and before value is assigned to total, has null calculated pageCount', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="10" page-size="2" first></ids-pager-input>`
    );

    expect(elem.pageCount).toEqual(null);
  });

  it('sets default page size on ids-pager-input for non-numeric value', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="10" page-size="2" total="100" first></ids-pager-input>`
    );

    elem.pageSize = 'z22';

    expect(elem.pageSize).toEqual(10);
  });

  it('sets pageNumber on ids-pager-input to non-numeric value and gets page-number reset to 1', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="1" page-size="2" total="100" first></ids-pager-input>`
    );

    elem.pageNumber = 'z22';
    expect(elem.pageNumber).toEqual(1);
  });

  it('sets total on ids-pager-input to invalid values and gets reset to 1', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-input page-number="1" page-size="2" total="100" first></ids-pager-input>`
    );

    elem.total = 'z22';
    expect(elem.total).toEqual(1);

    elem.total = 0;
    expect(elem.total).toEqual(1);
  });

  it('predictably handles the disabled attribute on ids-pager-input', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-input page-number="1" page-size="10" total="100" disabled></ids-pager-input>'
    );
    expect(elem.disabled).toEqual(true);

    elem.setAttribute('disabled', false);
    expect(elem.disabled).toEqual(false);

    elem.setAttribute('disabled', true);
    expect(elem.disabled).toEqual(true);

    elem.disabled = false;
    expect(elem.disabled).toEqual(false);

    elem.disabled = true;
    expect(elem.disabled).toEqual(true);
  });

  it('predictably handles the parent-disabled attribute on ids-pager-input', async () => {
    elem = await createElemViaTemplate(
      '<ids-pager-input page-number="1" page-size="10" total="100" parent-disabled></ids-pager-input>'
    );
    expect(elem.parentDisabled).toEqual(true);

    elem.setAttribute('parent-disabled', false);
    expect(elem.parentDisabled).toEqual(false);

    elem.setAttribute('parent-disabled', true);
    expect(elem.parentDisabled).toEqual(true);

    elem.parentDisabled = false;
    expect(elem.parentDisabled).toEqual(false);

    elem.parentDisabled = true;
    expect(elem.parentDisabled).toEqual(true);
  });

  it('it sets the pageSize on ids-pager-number-list to non numeric and it is reset to default', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="1" page-size="z2z" total="100" first></ids-pager-number-list>`
    );

    expect(elem.pageSize).toEqual(10);
  });

  it('it sets the pageNumber on ids-pager-number-list to invalid sizes and it is reset to 1', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="zz" page-size="2" total="100" first></ids-pager-number-list>`
    );

    expect(elem.pageNumber).toEqual(1);

    elem.pageNumber = -1;
    expect(elem.pageNumber).toEqual(1);
  });

  it('it sets the total on ids-pager-number-list to invalid sizes and it is reset to 1', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="1" page-size="2" total="z2z" first></ids-pager-number-list>`
    );

    expect(elem.total).toEqual(1);

    elem.total = -1;
    expect(elem.total).toEqual(1);
  });

  it('sets disabled predictably on ids-pager-number-list', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="10" page-size="2" total="100"></ids-pager-number-list>`
    );

    expect(elem.disabled).toEqual(false);
    expect(elem.hasAttribute('disabled')).toEqual(false);

    elem.disabled = true;
    expect(elem.disabled).toEqual(true);
    expect(elem.hasAttribute('disabled')).toEqual(true);

    elem.disabled = false;
    expect(elem.disabled).toEqual(false);
    expect(elem.hasAttribute('disabled')).toEqual(false);

    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="10" page-size="2" total="100" disabled></ids-pager-number-list>`
    );

    elem.disabled = true;
  });

  it('sets parent-disabled predictably on ids-pager-number-list', async () => {
    elem = await createElemViaTemplate(
      `<ids-pager-number-list page-number="10" page-size="2" total="100"></ids-pager-number-list>`
    );

    expect(elem.parentDisabled).toEqual(false);
    expect(elem.hasAttribute('parent-disabled')).toEqual(false);

    elem.parentDisabled = true;
    expect(elem.parentDisabled).toEqual(true);
    expect(elem.hasAttribute('parent-disabled')).toEqual(true);

    elem.parentDisabled = false;
    expect(elem.parentDisabled).toEqual(false);
    expect(elem.hasAttribute('parent-disabled')).toEqual(false);
  });
});
