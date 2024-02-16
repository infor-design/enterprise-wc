/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import createFromTemplate from '../helpers/create-from-template';
import wait from '../helpers/wait';

import IdsActionPanel from '../../src/components/ids-action-panel/ids-action-panel';
import '../../src/components/ids-button/ids-button';
import '../../src/components/ids-toolbar/ids-toolbar';
import type IdsPopup from '../../src/components/ids-popup/ids-popup';

describe('IdsActionPanel Component', () => {
  let cap: IdsActionPanel;

  beforeEach(async () => {
    cap = new IdsActionPanel();
    document.body.appendChild(cap);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    (cap as any) = null;
  });

  it.skip('responds to its normal buttons\' clicks', async () => {
    // Insert a header toolbar
    cap.insertAdjacentHTML('afterbegin', `<ids-toolbar slot="toolbar">
      <ids-toolbar-section type="title">
        <ids-text font-size="20" type="h2">Company Information</ids-text>
      </ids-toolbar-section>

      <ids-toolbar-section type="buttonset" align="end">
        <ids-button id="btn-save" icon="save" no-padding>
          <ids-text font-weight="semi-bold">Save</ids-text>
        </ids-button>
        <ids-separator vertical="true"></ids-separator>
        <ids-button id="btn-close" icon="close" no-padding>
          <ids-text font-weight="semi-bold">Close</ids-text>
        </ids-button>
      </ids-toolbar-section>
    </ids-toolbar>`);

    // Setup a button click handler
    (cap.popup as IdsPopup).animated = false;
    cap.onButtonClick = () => { cap.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the CAP
    await cap.show();
    await wait(310);

    // Click the first CAP button. The above handler should fire.
    cap.querySelector('#btn-save')?.dispatchEvent(clickEvent);
    await wait(310);

    expect(cap.visible).toBeFalsy();
  });

  test('renders with toolbar and buttons', () => {
    cap = createFromTemplate(cap, `<ids-action-panel>
      <ids-toolbar slot="toolbar">
        <ids-toolbar-section type="title">
          <ids-text font-size="20" type="h2">Company Information</ids-text>
        </ids-toolbar-section>
      </ids-toolbar>
    </ids-action-panel>`);
    cap.template();
    expect(cap.toolbar).toBeTruthy();
    expect(cap.buttons).toBeTruthy();
    expect(cap.template()).toContain('toolbar');
  });

  test('renders with no toolbar and buttons', () => {
    cap = createFromTemplate(cap, `<ids-action-panel id="cap-company-info"></ids-action-panel>`);
    cap.template();
    expect(cap.toolbar).toBeFalsy();
    expect(cap.buttons.length).toBe(0);
  });

  test('can prevent being opened with the `beforeshow` event', async () => {
    cap.addEventListener('beforeshow', (e: any) => {
      e.detail.response(false);
    });
    await cap.show();

    expect(cap.visible).toEqual(false);
  });

  test('can prevent being closed with the `beforehide` event', async () => {
    cap.addEventListener('beforehide', (e: any) => {
      e.detail.response(false);
    });
    await cap.show();
    await wait(110);
    await cap.hide();
    await wait(110);

    expect(cap.visible).toBeTruthy();
  });

  test('should be able to set attributes before append', async () => {
    const elem: any = new IdsActionPanel();
    elem.id = 'test';
    document.body.appendChild(elem);

    expect(elem.getAttribute('id')).toEqual('test');
  });

  test('should be able to set attributes after append', async () => {
    const elem: any = new IdsActionPanel();
    document.body.appendChild(elem);
    elem.id = 'test';

    expect(elem.getAttribute('id')).toEqual('test');
  });
});
