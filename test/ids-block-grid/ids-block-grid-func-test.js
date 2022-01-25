/**
 * @jest-environment jsdom
 */
import IdsBlockgrid from '../../src/components/ids-block-grid/ids-block-grid';
import IdsBlockgridItem from '../../src/components/ids-block-grid/ids-block-grid-item';
import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsBlockgrid Component', () => {
  let blockgridEl;

  beforeEach(async () => {
    const blockgrid = new IdsBlockgrid();
    const blockgridItem = new IdsBlockgridItem();

    document.body.appendChild(blockgrid);

    blockgrid.appendChild(blockgridItem);

    blockgridEl = document.querySelector('ids-block-grid');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsBlockgridItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-block-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    blockgridEl.align = 'left';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'center';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'right';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
  });

  it('renders align setting', () => {
    blockgridEl.align = 'center';
    expect(blockgridEl.align).toEqual('center');
    expect(blockgridEl.getAttribute('align')).toEqual('center');
  });

  it('renders blockgrid left correctly then removes it', () => {
    const elem = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.align = 'center';
    expect(elem.align).toEqual('center');
    expect(elem.getAttribute('align')).toEqual('center');
    expect(elem.style.textAlign).toEqual('center');

    elem.removeAttribute('align');
    expect(elem.getAttribute('align')).toEqual(null);
    expect(elem.style.textAlign).toEqual('');
  });
});

describe('IdsBlockgridItem Component', () => {
  let blockgridEl;
  let blockgridItemEl;

  beforeEach(async () => {
    const blockgrid = new IdsBlockgrid();
    const blockgridItem = new IdsBlockgridItem();

    document.body.appendChild(blockgrid);

    blockgridItem.innerHTML = `
  <img src="/assets/placeholder-200x200.png" alt="Placeholder 200x200" />
  <ids-text type="p">
    Sheena Taylor<br/>
    Infor, Developer
  </ids-text>
`;
    blockgrid.appendChild(blockgridItem);

    blockgridEl = document.querySelector('ids-block-grid');
    blockgridItemEl = document.querySelector('ids-block-grid-item');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsBlockgridItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-block-grid-item').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(blockgridItemEl.outerHTML).toMatchSnapshot();
  });

  it('support block grid selection single', () => {
    const clickEvent = new MouseEvent('click');
    blockgridItemEl.selection = 'single';

    blockgridItemEl.dispatchEvent(clickEvent);
    expect(blockgridItemEl.selected).toBe('true');

    blockgridItemEl.dispatchEvent(clickEvent);
    expect(blockgridItemEl.selected).toBe('false');
  });

  it('support block grid selection multiple', () => {
    const blockgridItemEl2 = new IdsBlockgridItem();
    blockgridEl.appendChild(blockgridItemEl2);
    blockgridItemEl2.selection = 'multiple';

    const clickEvent = new MouseEvent('click', { bubbles: true });
    blockgridItemEl.selection = 'multiple';

    const checkboxEl = blockgridItemEl.shadowRoot.querySelector('ids-checkbox');
    const checkboxEl2 = blockgridItemEl2.shadowRoot.querySelector('ids-checkbox');

    blockgridItemEl.dispatchEvent(clickEvent);
    expect(checkboxEl.checked).toBe('true');
    expect(checkboxEl2.checked).not.toBe('true');

    blockgridItemEl2.dispatchEvent(clickEvent);
    expect(checkboxEl.checked).toBe('true');
    expect(checkboxEl2.checked).toBe('true');
  });

  it('support block grid selection multiple keyboard', () => {
    const blockgridItemEl2 = new IdsBlockgridItem();
    blockgridEl.appendChild(blockgridItemEl2);
    blockgridItemEl2.selection = 'multiple';

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    blockgridItemEl.selection = 'multiple';

    blockgridItemEl.container.focus();
    blockgridItemEl.dispatchEvent(tabEvent);
    expect(document.activeElement).toEqual(blockgridItemEl2);

    blockgridItemEl2.dispatchEvent(spaceEvent);
    expect(blockgridItemEl.selected).not.toBe('true');
    expect(blockgridItemEl2.selected).toBe('true');
  });

  it('support block grid selection mixed 1', async () => {
    const blockgridItemEl2 = new IdsBlockgridItem({ selection: 'mixed' });
    blockgridEl.appendChild(blockgridItemEl2);

    const clickEvent = new MouseEvent('click', { bubbles: true });

    blockgridItemEl2.dispatchEvent(clickEvent);
    expect(blockgridItemEl2.preselected).toBe('true');
    expect(blockgridItemEl2.selected).not.toBe('true');
  });

  it('support block grid selection mixed 2', async () => {
    const blockgridItemEl2 = new IdsBlockgridItem({ selection: 'mixed' });
    blockgridEl.appendChild(blockgridItemEl2);
    const checkboxEl2 = blockgridItemEl2.shadowRoot.querySelector('ids-checkbox');

    const clickEvent = new MouseEvent('click', { bubbles: true });
    checkboxEl2.dispatchEvent(clickEvent);
    expect(blockgridItemEl2.selected).toBe('true');
  });

  it('should fire selectionchanged event', async () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toEqual(blockgridItemEl);
      expect(x.detail.selected).toEqual('true');
      expect(x.detail.selection).toEqual('multiple');
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    blockgridItemEl.selection = 'multiple';

    blockgridItemEl.addEventListener('selectionchanged', mockCallback);
    blockgridItemEl.dispatchEvent(clickEvent);

    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
