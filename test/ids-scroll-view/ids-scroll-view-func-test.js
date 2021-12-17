/**
 * @jest-environment jsdom
 */
import IdsScrollView from '../../src/components/ids-scroll-view/ids-scroll-view';
import IntersectionObserver from '../helpers/intersection-observer-mock';

describe('IdsScrollView Component', () => {
  let scrollView;
  const html = `<img slot="scroll-view-item" src="/assets/camera-1.png" alt="Slide 1, Sony Camera, Front"/>
  <img slot="scroll-view-item" src="/assets/camera-2.png" alt="Slide 3, Sony Camera, Back Display"/>
  <img slot="scroll-view-item" src="/assets/camera-3.png" alt="Slide 3, Sony Camera, From Top"/>
  <img slot="scroll-view-item" src="/assets/camera-4.png" alt="Slide 4, Olympus Camera, Front"/>
  <img slot="scroll-view-item" src="/assets/camera-5.png" alt="Slide 5, Olympus Camera, Exposed to water"/>
  <img slot="scroll-view-item" src="/assets/camera-6.png" alt="Slide 6, Sony E-mount Camera, Front"/>`;

  beforeEach(async () => {
    // Mock IntersectionObserver
    window.IntersectionObserver = IntersectionObserver;

    // Append the element
    const elem = new IdsScrollView();
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
    const elem = new IdsScrollView();
    elem.innerHTML = html;
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-scroll-view').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders correctly', () => {
    expect(scrollView.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('can click the circle buttons', () => {
    const link = scrollView.shadowRoot.querySelector('[href="#id-4"]');
    link.click();
    expect(link.getAttribute('tabindex')).toEqual('0');
    expect(link.getAttribute('aria-selected')).toEqual('true');
  });

  it('can click the control area and nothing happens', () => {
    scrollView.shadowRoot.querySelector('.ids-scroll-view-controls').click();
    const link = scrollView.shadowRoot.querySelector('[href="#id-0"]');
    expect(link.getAttribute('tabindex')).toEqual('0');
    expect(link.getAttribute('aria-selected')).toEqual('true');
  });

  it('moved on ArrowLeft/ArrowRight', () => {
    const controls = scrollView.shadowRoot.querySelector('.ids-scroll-view-controls');
    const testArrowKey = (key, id) => {
      scrollView.dispatchEvent(new KeyboardEvent('keydown', { key }));
      const link = controls.querySelector(`[href="#${id}"]`);
      expect(link.getAttribute('tabindex')).toEqual('0');
      expect(link.getAttribute('aria-selected')).toEqual('true');
    };

    // One back wont do anything
    testArrowKey('ArrowLeft', 'id-0');
    // key all the way right
    testArrowKey('ArrowRight', 'id-1');
    testArrowKey('ArrowRight', 'id-2');
    testArrowKey('ArrowRight', 'id-3');
    testArrowKey('ArrowRight', 'id-4');
    testArrowKey('ArrowRight', 'id-5');
    // One extra wont do anything
    testArrowKey('ArrowRight', 'id-5');
    // key all the way back
    testArrowKey('ArrowLeft', 'id-4');
    testArrowKey('ArrowLeft', 'id-3');
    testArrowKey('ArrowLeft', 'id-2');
    testArrowKey('ArrowLeft', 'id-1');
    testArrowKey('ArrowLeft', 'id-0');
    testArrowKey('ArrowLeft', 'id-0');
  });
});
