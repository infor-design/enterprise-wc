/**
 * @jest-environment jsdom
 */
// eslint-disable-next-line
import MutationObserver from '../helpers/mutation-observer-mock';
import processAnimFrame from '../helpers/process-anim-frame';
import IdsInput from '../../src/ids-input/ids-input';
import IdsPager, {
  IdsPagerInput,
  IdsPagerButton,
  IdsPagerNumberList
} from '../../src/ids-pager';

const HTMLSnippets = {
  NAV_BUTTONS_AND_INPUT: (
    `<ids-pager page-size="20" page-number="10" total="200">
      <ids-pager-section>
        <ids-pager-button first></ids-pager-button>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-input></ids-pager-input>
        <ids-pager-button next></ids-pager-button>
        <ids-pager-button last></ids-pager-button>
      </ids-pager-section>
    </ids-pager>`
  ),
  NUMBER_LIST_NAV: (
  `<ids-pager page-size="20" page-number="10" total="150">
      <ids-pager-section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </ids-pager-section>
  </ids-pager>`
  ),
  RIGHT_ALIGNED_CONTENT: (
    `<ids-pager page-size="20" page-number="10" total="150">
      <ids-pager-section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </ids-pager-section>
      <ids-pager-section>
        Right-Aligned Content
      </ids-pager-section>
    </ids-pager>`
  ),
  DOUBLE_SIDED_CONTENT: (
    `<ids-pager page-size="20" page-number="10" total="150">
      <ids-pager-section>
        Left-Aligned-Content
      </ids-pager-section>
      <ids-pager-section>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-number-list></ids-pager-number-list>
        <ids-pager-button next></ids-pager-button>
      </ids-pager-section>
      <ids-pager-section>
        Right-Aligned-Content
      </ids-pager-section>
    </ids-pager>`
  )
};

describe('IdsPager Component', () => {
  let elem;

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

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

  it('renders from HTML Template with nav buttons with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders from HTML Template with number list navigation with no errors', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NUMBER_LIST_NAV);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-pager').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
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

  it('updates the input on ids-pager-input and pager pageNumber updates', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const idsPagerInput = elem.querySelector('ids-pager-input');
    idsPagerInput.input.value = '10';
    await processAnimFrame();
    idsPagerInput.input.dispatchEvent(new Event('change', { bubbles: true }));
    await processAnimFrame();

    expect(elem.pageNumber).toEqual(10);
  });

  it('sets the pager page-number to non numeric and pagerNumber gets reset to 1', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('page-number', 'z35');
    await processAnimFrame();
    await processAnimFrame();

    expect(elem.pageNumber).toEqual(1);
  });

  it('sets the pager page-number above max and pagerNumber gets set to pageCount', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    elem.setAttribute('page-number', '100');
    expect(elem.pageNumber).toEqual(10);
  });

  it('creates a pager and toggles the last button attribute predictably', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const lastNavButton = elem.querySelector('ids-pager-button[last]');
    lastNavButton.setAttribute('disabled', true);
    expect(lastNavButton.disabled).toEqual(true);

    lastNavButton.disabled = false;
    expect(lastNavButton.hasAttribute('disabled')).toEqual(false);
  });

  it('creates a pager and the "type" of each of its nav button when accessed is based on their flag attrib', async () => {
    elem = await createElemViaTemplate(HTMLSnippets.NAV_BUTTONS_AND_INPUT);
    const navButtons = elem.querySelectorAll('ids-pager-button');
    navButtons.forEach((idsPagerButton) => {
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
    elem.setAttribute('page-number', 5);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeFalsy();
    elem.setAttribute('page-number', 1);
    await processAnimFrame();
    expect(elem.hasAttribute('nav-disabled')).toBeTruthy();
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

  it('creates a an ids-pager-button with "last" flag set and nav-disabled works reliably', async () => {
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
});
