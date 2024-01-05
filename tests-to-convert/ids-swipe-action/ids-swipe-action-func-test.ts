/**
 * @jest-environment jsdom
 */
import IdsSwipeAction from '../../src/components/ids-swipe-action/ids-swipe-action';

const exampleHTML = `
<ids-button slot="action-left" id="action-left-continuous" type="swipe-action-left">
  <ids-icon icon="reply" size="xsmall"></ids-icon>
  <span>Left Action</span>
</ids-button>
<div slot="contents">
  <ids-layout-grid cols="2" no-margins="true">
    <ids-layout-grid-cell>
      <ids-text font-size="16">Tuesday, 22nd September</ids-text>
      <ids-text font-size="14">8:40AM-2:00PM</ids-text>
    </ids-layout-grid-cell>
    <ids-layout-grid-cell justify="end">
      <ids-menu-button id="actions-continuous" menu="actions-continuous-menu">
        <ids-icon icon="more"></ids-icon>
        <span class="audible">Actions</span>
      </ids-menu-button>
      <ids-popup-menu id="actions-continuous-menu" target="actions-continuous" trigger-type="click">
        <ids-menu-group>
          <ids-menu-item>Right Action</ids-menu-item>
          <ids-menu-item>Left Action</ids-menu-item>
          <ids-menu-item>Other Action</ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>
    </ids-layout-grid-cell>
  </ids-layout-grid>
</div>
<ids-button slot="action-right" id="action-right-continuous" type="swipe-action-right">
  <ids-icon icon="tack" size="xsmall"></ids-icon>
  <span>Right Action</span>
</ids-button>
`;

describe('IdsSwipeAction Component', () => {
  let swipeAction: any;

  beforeEach(async () => {
    const elem: any = new IdsSwipeAction();
    elem.swipeType = 'continuous';
    document.body.appendChild(elem);
    elem.insertAdjacentHTML('afterbegin', exampleHTML);
    swipeAction = document.querySelector('ids-swipe-action');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it.skip('renders scroll position on reveal', (done) => {
    swipeAction.swipeType = 'reveal';
    setTimeout(() => {
      expect(swipeAction.container.scrollLeft).toEqual(85);
      done();
    }, 200);

    swipeAction.container.scrollLeft = 0;
    swipeAction.swipeType = 'continuous';
    expect(swipeAction.container.scrollLeft).toEqual(0);
  });

  it('clicks the actions buttons on swipe left', () => {
    swipeAction.swipeType = 'continuous';
    const mockCallback = jest.fn((e) => {
      expect(e.detail.direction).toEqual('left');
    });
    swipeAction.addEventListener('swipe', mockCallback);
    const event = new CustomEvent('swipe', { detail: { direction: 'left' } });
    swipeAction.dispatchEvent(event);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('can click the right button and reset scroll', () => {
    swipeAction.swipeType = 'reveal';
    document.querySelector<any>('#action-right-continuous').click();
    expect(swipeAction.container.scrollLeft).toEqual(0);
  });

  it('can click the left button and reset scroll', () => {
    swipeAction.swipeType = 'reveal';
    document.querySelector<any>('#action-left-continuous').click();
    expect(swipeAction.container.scrollLeft).toEqual(0);
  });
});
