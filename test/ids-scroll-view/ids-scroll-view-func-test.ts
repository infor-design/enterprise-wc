/**
 * @jest-environment jsdom
 */
import { attributes } from '../../src/core/ids-attributes';
import IdsScrollView from '../../src/components/ids-scroll-view/ids-scroll-view';
import IntersectionObserver from '../helpers/intersection-observer-mock';
import wait from '../helpers/wait';

describe('IdsScrollView Component', () => {
  let scrollView: any;
  const html = `<img slot="scroll-view-item" src="../assets/images/camera-1.png" alt="Slide 1, Sony Camera, Front"/>
  <img slot="scroll-view-item" src="../assets/images/camera-2.png" alt="Slide 3, Sony Camera, Back Display"/>
  <img slot="scroll-view-item" src="../assets/images/camera-3.png" alt="Slide 3, Sony Camera, From Top"/>
  <img slot="scroll-view-item" src="../assets/images/camera-4.png" alt="Slide 4, Olympus Camera, Front"/>
  <img slot="scroll-view-item" src="../assets/images/camera-5.png" alt="Slide 5, Olympus Camera, Exposed to water"/>
  <img slot="scroll-view-item" src="../assets/images/camera-6.png" alt="Slide 6, Sony E-mount Camera, Front"/>`;

  beforeEach(async () => {
    // Mock IntersectionObserver
    (<any>window).IntersectionObserver = IntersectionObserver;

    // Append the element
    const elem: any = new IdsScrollView();
    elem.innerHTML = html;
    document.body.appendChild(elem);
    scrollView = document.querySelector('ids-scroll-view');

    // Mock scrollBy
    elem.container.scrollBy = jest.fn();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    scrollView.remove();
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsScrollView();
    elem.innerHTML = html;
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-scroll-view').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders correctly', () => {
    expect(scrollView.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('should sets loop', () => {
    expect(scrollView.getAttribute(attributes.LOOP)).toEqual(null);
    expect(scrollView.loop).toEqual(false);
    scrollView.loop = true;
    expect(scrollView.getAttribute(attributes.LOOP)).toEqual('');
    expect(scrollView.loop).toEqual(true);
    scrollView.loop = false;
    expect(scrollView.getAttribute(attributes.LOOP)).toEqual(null);
    expect(scrollView.loop).toEqual(false);
  });

  it('should sets show tooltip', () => {
    expect(scrollView.getAttribute(attributes.SHOW_TOOLTIP)).toEqual(null);
    expect(scrollView.showTooltip).toEqual(false);
    scrollView.showTooltip = true;
    expect(scrollView.getAttribute(attributes.SHOW_TOOLTIP)).toEqual('');
    expect(scrollView.showTooltip).toEqual(true);
    scrollView.showTooltip = false;
    expect(scrollView.getAttribute(attributes.SHOW_TOOLTIP)).toEqual(null);
    expect(scrollView.showTooltip).toEqual(false);
  });

  it('should sets suppress controls', () => {
    expect(scrollView.getAttribute(attributes.SUPPRESS_CONTROLS)).toEqual(null);
    expect(scrollView.suppressControls).toEqual(false);
    scrollView.suppressControls = true;
    expect(scrollView.getAttribute(attributes.SUPPRESS_CONTROLS)).toEqual('');
    expect(scrollView.suppressControls).toEqual(true);
    scrollView.suppressControls = false;
    expect(scrollView.getAttribute(attributes.SUPPRESS_CONTROLS)).toEqual(null);
    expect(scrollView.suppressControls).toEqual(false);
  });

  it('should call control api', async () => {
    const slideExpect = async (expectNum: number) => {
      const selEl = scrollView.controls.querySelector('.selected');
      expect(selEl.getAttribute('data-slide-number')).toEqual(`${expectNum}`);
    };
    await slideExpect(0);

    scrollView.next();
    await slideExpect(1);

    scrollView.previous();
    await slideExpect(0);

    scrollView.last();
    await slideExpect(5);

    scrollView.first();
    await slideExpect(0);

    scrollView.slideTo(2);
    await slideExpect(2);
  });

  it('can click the circle buttons', () => {
    const link = scrollView.controls.querySelector('[data-slide-number="4"]');
    expect(link.classList.contains('selected')).toBeFalsy();
    expect(link.getAttribute('aria-selected')).toEqual(null);

    link.click();
    expect(link.classList.contains('selected')).toBeTruthy();
    expect(link.getAttribute('aria-selected')).toEqual('true');
  });

  it.skip('can click the control area and nothing happens', () => {
    scrollView.shadowRoot.querySelector('.ids-scroll-view-controls').click();
    const link = scrollView.controls.querySelector('[data-slide-number="0"]');
    expect(link.classList.contains('selected')).toBeTruthy();
    expect(link.getAttribute('aria-selected')).toEqual('true');
  });

  it('should rerender controls based on slotchange events', async () => {
    document.body.innerHTML = '';
    const elem = new IdsScrollView();
    document.body.appendChild(elem);
    elem.innerHTML = html;
    await wait(1000);
    expect(elem.controls?.querySelectorAll('ids-button.circle-button').length).toEqual(6);
  });

  it('moved on ArrowLeft/ArrowRight', () => {
    const testArrowKey = (key: string, id: string) => {
      scrollView.dispatchEvent(new KeyboardEvent('keydown', { key }));
      const link = scrollView.controls.querySelector(`[data-slide-number="${id}"]`);
      expect(link.classList.contains('selected')).toBeTruthy();
      expect(link.getAttribute('aria-selected')).toEqual('true');
    };

    // One back wont do anything
    testArrowKey('ArrowLeft', '0');
    // key all the way right
    testArrowKey('ArrowRight', '1');
    testArrowKey('ArrowRight', '2');
    testArrowKey('ArrowRight', '3');
    testArrowKey('ArrowRight', '4');
    testArrowKey('ArrowRight', '5');
    // One extra wont do anything
    testArrowKey('ArrowRight', '5');
    // key all the way back
    testArrowKey('ArrowLeft', '4');
    testArrowKey('ArrowLeft', '3');
    testArrowKey('ArrowLeft', '2');
    testArrowKey('ArrowLeft', '1');
    testArrowKey('ArrowLeft', '0');
    testArrowKey('ArrowLeft', '0');
    testArrowKey('Enter', '0');
  });
});
