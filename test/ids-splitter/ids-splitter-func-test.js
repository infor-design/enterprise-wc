/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import ResizeObserver from '../helpers/resize-observer-mock'; // eslint-disable-line
import IdsContainer from '../../src/components/ids-container';
import IdsSplitter from '../../src/components/ids-splitter';

describe('IdsSplitter Component', () => {
  let container;
  let splitter;

  // Defaults
  const DEFAULTS = {
    axis: 'x',
    align: 'start',
    label: 'Resize',
    disabled: false,
    resizeOnDragEnd: false
  };

  // Event name strings
  const EVENTS = {
    beforecollapsed: 'beforecollapsed',
    collapsed: 'collapsed',
    beforeexpanded: 'beforeexpanded',
    expanded: 'expanded',
    beforesizechanged: 'beforesizechanged',
    sizechanged: 'sizechanged'
  };

  beforeEach(async () => {
    const elem = new IdsSplitter();
    container = new IdsContainer();
    container.appendChild(elem);
    document.body.appendChild(container);
    splitter = container.querySelector('ids-splitter');
    splitter.language = 'en';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsSplitter();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-splitter').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set align to splitter', () => {
    expect(splitter.getAttribute('align')).toEqual(null);
    expect(splitter.align).toEqual(DEFAULTS.align);
    splitter.align = 'end';
    expect(splitter.getAttribute('align')).toEqual('end');
    expect(splitter.align).toEqual('end');
    splitter.align = 'start';
    expect(splitter.getAttribute('align')).toEqual('start');
    expect(splitter.align).toEqual('start');
    splitter.align = null;
    expect(splitter.getAttribute('align')).toEqual(null);
    expect(splitter.align).toEqual(DEFAULTS.align);
  });

  it('should set axis to splitter', () => {
    expect(splitter.getAttribute('axis')).toEqual(null);
    expect(splitter.axis).toEqual(DEFAULTS.axis);
    splitter.axis = 'y';
    expect(splitter.getAttribute('axis')).toEqual('y');
    expect(splitter.axis).toEqual('y');
    splitter.axis = 'x';
    expect(splitter.getAttribute('axis')).toEqual('x');
    expect(splitter.axis).toEqual('x');
    splitter.axis = null;
    expect(splitter.getAttribute('axis')).toEqual(null);
    expect(splitter.axis).toEqual(DEFAULTS.axis);
  });

  it('should set disabled to splitter', () => {
    expect(splitter.getAttribute('disabled')).toEqual(null);
    expect(splitter.disabled).toEqual(DEFAULTS.disabled);
    splitter.disabled = true;
    expect(splitter.getAttribute('disabled')).toEqual('');
    expect(splitter.disabled).toEqual(true);
    splitter.disabled = false;
    expect(splitter.getAttribute('disabled')).toEqual(null);
    expect(splitter.disabled).toEqual(false);
    splitter.disabled = null;
    expect(splitter.getAttribute('disabled')).toEqual(null);
    expect(splitter.disabled).toEqual(DEFAULTS.disabled);
  });

  it('should set label to splitter', () => {
    expect(splitter.getAttribute('label')).toEqual(null);
    expect(splitter.label).toEqual(DEFAULTS.label);
    splitter.label = 'Custom Resize Text';
    expect(splitter.getAttribute('label')).toEqual('Custom Resize Text');
    expect(splitter.label).toEqual('Custom Resize Text');
    splitter.label = null;
    expect(splitter.getAttribute('label')).toEqual(null);
    expect(splitter.label).toEqual(DEFAULTS.label);
  });

  it('should set resize on drag end to splitter', () => {
    const attr = 'resize-on-drag-end';
    expect(splitter.getAttribute(attr)).toEqual(null);
    expect(splitter.resizeOnDragEnd).toEqual(DEFAULTS.resizeOnDragEnd);
    splitter.resizeOnDragEnd = true;
    expect(splitter.getAttribute(attr)).toEqual('');
    expect(splitter.resizeOnDragEnd).toEqual(true);
    splitter.resizeOnDragEnd = false;
    expect(splitter.getAttribute(attr)).toEqual(null);
    expect(splitter.resizeOnDragEnd).toEqual(false);
    splitter.resizeOnDragEnd = null;
    expect(splitter.getAttribute(attr)).toEqual(null);
    expect(splitter.resizeOnDragEnd).toEqual(DEFAULTS.resizeOnDragEnd);
  });

  it('should set initial size', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" size="30%"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').style.width).toEqual('30%');
    expect(splitter.querySelector('#p2').style.width).toEqual('70%');
    expect(splitter.sizes()).toEqual([30, 70]);
  });

  it('should set initial size and minimum size', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" min-size="10%" size="40%"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').style.width).toEqual('40%');
    expect(splitter.querySelector('#p2').style.width).toEqual('60%');
  });

  it('should set initial size smaller then minimum size', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" min-size="40%" size="10%"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').style.width).toEqual('40%');
    expect(splitter.querySelector('#p2').style.width).toEqual('60%');
  });

  it('should set minimum and maximum size', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" min-size="10%" max-size="80%"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').style.width).toEqual('50%');
    expect(splitter.querySelector('#p2').style.width).toEqual('50%');
    expect(splitter.minSizes()).toEqual([10, 0]);
    expect(splitter.maxSizes()).toEqual([80]);
  });

  it('should set minimum and maximum size extra cases', async () => {
    const errors = jest.spyOn(global.console, 'error');
    document.body.innerHTML = `
      <ids-splitter id="splitter-1">
        <ids-splitter-pane min-size="110%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane min-size="50%"></ids-splitter-pane>
        <ids-splitter-pane min-size="55%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter align="end">
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane min-size="85%" size="10%"></ids-splitter-pane>
        <ids-splitter-pane min-size="5%" size="10%"></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane max-size="30%" size="40%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane max-size="30%" min-size="40%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane max-size="30%" min-size="40%" size="10%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane max-size="110%"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane size="20%"></ids-splitter-pane>
        <ids-splitter-pane size="80%"></ids-splitter-pane>
      </ids-splitter>
      <ids-splitter>
        <ids-splitter-pane size="100px"></ids-splitter-pane>
        <ids-splitter-pane size="80"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('#splitter-1');
    splitter.disabled = true;
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set multiple splits', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.container.querySelectorAll('.ids-splitter-split-bar').length).toEqual(3);
  });

  it('should set nested splitter', async () => {
    const checkSplitter = (elem, axis = 'x') => {
      const splitBars = elem.container.querySelectorAll('.ids-splitter-split-bar');
      const orientation = axis === 'y' ? 'vertical' : 'horizontal';
      expect(elem.axis).toEqual(axis);
      expect(splitBars.length).toEqual(1);
      expect(splitBars[0].getAttribute('aria-orientation')).toEqual(orientation);
    };
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane id="nested-splitter-pane">
          <ids-splitter axis="y">
            <ids-splitter-pane></ids-splitter-pane>
            <ids-splitter-pane></ids-splitter-pane>
          </ids-splitter>
        </ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    checkSplitter(splitter);
    const nestedSplitter = splitter.querySelector('#nested-splitter-pane ids-splitter');
    checkSplitter(nestedSplitter, 'y');
  });

  it('should renders collapsed', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
  });

  it('should renders collapsed and disabled', async () => {
    document.body.innerHTML = `
      <ids-splitter disabled>
        <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    splitter.expand();
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
  });

  it('should renders with slot change', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.shadowRoot.querySelectorAll('.ids-splitter-split-bar').length).toEqual(1);
    const template = document.createElement('template');
    template.innerHTML = '<ids-splitter-pane></ids-splitter-pane>';
    splitter.appendChild(template.content.cloneNode(true));
    await processAnimFrame();
    expect(splitter.shadowRoot.querySelectorAll('.ids-splitter-split-bar').length).toEqual(2);
  });

  it('should set collapse and expand', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    splitter.expand({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
  });

  it('should not error collapse and expand', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane id="p2"></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.getPair();
    splitter.getPair({ startPane: '#test', endPane: '#p2' });
    splitter.getPair({ startPane: '#test', endPane: '#test' });
    splitter.getPair({
      startPane: splitter.querySelector('#p1'),
      endPane: splitter.querySelector('#p2')
    });
    splitter.collapse();
    splitter.expand();
    splitter.expand({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    splitter.expand({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    const pair = splitter.getPair({ startPane: '#p1', endPane: '#p2' });
    splitter.collapse({ pair });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
  });

  it('should veto before collapse response', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    splitter.addEventListener(EVENTS.beforecollapsed, (e) => {
      e.detail.response(false); // veto
    });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
  });

  it('should trigger collapsed event', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    const mockCallback = jest.fn(() => { });

    splitter.addEventListener(EVENTS.collapsed, mockCallback);
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should veto before expand response', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    splitter.addEventListener(EVENTS.beforeexpanded, (e) => {
      e.detail.response(false); // veto
    });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    splitter.expand({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
  });

  it('should trigger expanded event', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    const mockCallback = jest.fn(() => { });

    splitter.addEventListener(EVENTS.expanded, mockCallback);
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    splitter.expand({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should veto before size changed response', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    splitter.addEventListener(EVENTS.beforesizechanged, (e) => {
      e.detail.response(false); // veto
    });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
  });

  it('should trigger size changed event', async () => {
    document.body.innerHTML = `
      <ids-splitter>
        <ids-splitter-pane id="p1"></ids-splitter-pane>
        <ids-splitter-pane></ids-splitter-pane>
      </ids-splitter>`;
    await processAnimFrame();
    splitter = document.querySelector('ids-splitter');
    const mockCallback = jest.fn(() => { });

    splitter.addEventListener(EVENTS.sizechanged, mockCallback);
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual(null);
    splitter.collapse({ startPane: '#p1', endPane: '#p2' });
    expect(splitter.querySelector('#p1').getAttribute('collapsed')).toEqual('');
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
