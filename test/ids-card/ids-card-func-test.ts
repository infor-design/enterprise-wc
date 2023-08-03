/**
 * @jest-environment jsdom
 */
import IdsCard from '../../src/components/ids-card/ids-card';
import IdsCardAction from '../../src/components/ids-card/ids-card-action';

describe('IdsCard Component', () => {
  let card: any;

  beforeEach(async () => {
    const elem: any = new IdsCard();
    elem.innerHTML = `<div slot="card-header">
            <ids-text font-size="20" type="h2">Card Title Two</ids-text>
          </div>
          <div slot="card-content">
          </div>`;
    document.body.appendChild(elem);
    card = document.querySelector('ids-card');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsCard();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-card').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(card.outerHTML).toMatchSnapshot();
  });

  it('renders auto-height from an attribute', () => {
    card.setAttribute('auto-height', 'true');
    expect(card.getAttribute('auto-height')).toEqual('true');
  });

  it('renders auto-fit from an attribute', () => {
    card.setAttribute('auto-fit', 'true');
    expect(card.autoFit).toEqual(true);
    expect(card.getAttribute('auto-fit')).toEqual('true');
    card.setAttribute('auto-fit', 'false');
    expect(card.autoFit).toEqual(false);
    expect(card.getAttribute('auto-fit')).toEqual(null);
  });

  it('renders success color from the api', () => {
    card.autoHeight = true;
    expect(card.getAttribute('auto-height')).toEqual('true');
    expect(card.autoHeight).toEqual('true');
  });

  it('renders overflow setting from the api', () => {
    card.overflow = 'hidden';
    expect(card.template().includes('overflow-hidden')).toBe(true);
    expect(card.container.querySelector('.ids-card-content').classList.contains('overflow-hidden')).toBe(true);
    card.overflow = 'auto';
    expect(card.container.querySelector('.ids-card-content').classList.contains('overflow-hidden')).toBe(false);
  });

  it('removes the clickable attribute when reset', () => {
    card.autoHeight = true;
    expect(card.getAttribute('auto-height')).toEqual('true');

    card.autoHeight = false;
    expect(card.getAttribute('auto-height')).toEqual(null);
    expect(card.autoHeight).toEqual(null);
  });

  it('removes the overflow attribute when reset', () => {
    card.overflow = 'hidden';
    expect(card.getAttribute('overflow')).toEqual('hidden');

    card.overflow = 'auto';
    expect(card.getAttribute('overflow')).toEqual(null);
  });

  it('add the overflow class when reset', () => {
    card.overflow = 'hidden';
    card.template();
    expect(card.container.querySelector('.ids-card-content').classList.contains('overflow-hidden')).toBeTruthy();
  });

  it('support card selection single', () => {
    const clickEvent = new MouseEvent('click', { bubbles: true });
    card.selection = 'single';

    card.dispatchEvent(clickEvent);
    expect(card.selected).toBe(true);

    card.dispatchEvent(clickEvent);
    expect(card.selected).toBe(true);
  });

  it('support card selection multiple', () => {
    const clickEvent = new MouseEvent('click', { bubbles: true });
    card.selection = 'multiple';
    // Add event handler
    card.connectedCallback();
    card.cardTemplate();
    const checkboxElem = card.shadowRoot.querySelector('ids-checkbox');

    // when user click card container
    card.dispatchEvent(clickEvent);
    expect(card.selected).toBe(true);
    expect(checkboxElem.checked).toBeTruthy();

    card.dispatchEvent(clickEvent);
    expect(card.selected).toBe(false);
    expect(checkboxElem.checked).toBeFalsy();

    checkboxElem.dispatchEvent(clickEvent);
    expect(card.selected).toBe(true);
    expect(checkboxElem.checked).toBeTruthy();

    checkboxElem.dispatchEvent(clickEvent);
    expect(card.selected).toBe(false);
    expect(checkboxElem.checked).toBeFalsy();
  });

  it('should fire selectionchanged event', async () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toEqual(card);
      expect(x.detail.selected).toEqual(true);
      expect(x.detail.selection).toEqual('multiple');
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    card.selection = 'multiple';

    card.addEventListener('selectionchanged', mockCallback);
    card.dispatchEvent(clickEvent);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should set no header setting', () => {
    expect(card.getAttribute('no-header')).toEqual(null);
    expect(card.noHeader).toEqual(null);
    card.noHeader = true;

    expect(card.getAttribute('no-header')).toEqual('true');
    expect(card.noHeader).toEqual('true');
    card.noHeader = false;

    expect(card.getAttribute('no-header')).toEqual(null);
    expect(card.noHeader).toEqual(null);
  });

  it('should set css class for footer', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsCard();
    elem.innerHTML = `
      <div slot="card-header"></div>
      <div slot="card-content"></div>
      <div slot="card-footer"></div>`;
    document.body.appendChild(elem);
    card = document.querySelector('ids-card');

    expect(card.container.classList.contains('has-footer')).toEqual(true);
  });

  describe('Actionable Ids Card', () => {
    let actionableCard: any;

    beforeEach(() => {
      const html = `
         <ids-card actionable="true" href="https://www.example.com" target="_blank">
           <div slot="card-content">
             <ids-text font-size="20" type="h2">Actionable Card Link</ids-text>
           </div>
         </ids-card>
       `;
      document.body.innerHTML = html;
      actionableCard = document.querySelector('ids-card');
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should allow setting href', () => {
      const expectedHref = '#section';
      actionableCard.href = expectedHref;
      expect(actionableCard.href).toEqual(expectedHref);

      actionableCard.href = '';
      expect(actionableCard.href).toBeNull();
    });

    it('renders with no errors', () => {
      const errors = jest.spyOn(global.console, 'error');
      const elem: any = new IdsCardAction();
      document.body.appendChild(elem);
      expect(document.querySelectorAll('ids-card-action').length).toEqual(1);
      expect(errors).not.toHaveBeenCalled();
    });

    it('renders card action correctly', () => {
      const elem: any = new IdsCardAction();
      document.body.appendChild(elem);
      expect(elem.outerHTML).toMatchSnapshot();
    });

    it('renders card action markup correctly', () => {
      card.href = '/something';
      expect(card.actionableButtonTemplate()).toMatchSnapshot();
    });

    it('renders card action markup', () => {
      expect(card.template()).toMatchSnapshot();
      card.href = '';
      card.actionable = true;
      expect(card.template()).toMatchSnapshot();
      card.href = '/something';
      expect(card.template()).toMatchSnapshot();
    });

    it('should allow setting actionable', () => {
      card.actionable = true;
      expect(card.getAttribute('actionable')).toEqual('true');
      card.actionable = false;
      expect(card.getAttribute('actionable')).toBeFalsy();
    });

    it('should allow setting href', () => {
      const expectedHref = '#section';
      actionableCard.href = expectedHref;
      expect(actionableCard.href).toEqual(expectedHref);

      actionableCard.href = '';
      expect(actionableCard.href).toBeNull();
    });

    it('should allow setting target', () => {
      const expectedTarget = '_blank';
      actionableCard.target = expectedTarget;
      expect(actionableCard.target).toEqual(expectedTarget);

      actionableCard.target = '';
      expect(actionableCard.target).toBeNull();
    });

    it('should allow setting height', () => {
      card.actionable = true;
      actionableCard.height = '100';
      expect(actionableCard.height).toEqual('100');

      actionableCard.height = null;
      expect(actionableCard.height).toBe('');
    });

    it('should allow setting height with a link', () => {
      document.body.innerHTML = '';
      const html = `
        <ids-card actionable="true" href="https://www.example.com" target="_self">
          <div slot="card-content">
            <ids-text font-size="16" type="p">Actionable Link Card</ids-text>
          </div>
        </ids-card>
      `;
      document.body.innerHTML = html;
      actionableCard = document.querySelector('ids-card');
      actionableCard.height = '200';
      expect(actionableCard.height).toEqual('200');

      actionableCard.height = null;
      expect(actionableCard.height).toBe('');
    });
  });
});
