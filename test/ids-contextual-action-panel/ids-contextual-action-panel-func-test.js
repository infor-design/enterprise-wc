/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import wait from '../helpers/wait';

import IdsContextualActionPanel from '../../src/components/ids-contextual-action-panel/ids-contextual-action-pane-base';
import { IdsButton } from '../../src/components/ids-button/ids-button';
import { IdsToolbar } from '../../src/components/ids-toolbar/ids-toolbar';

describe('IdsContextualActionPanel Component', () => {
  let cap;

  beforeEach(async () => {
    const elem = new IdsContextualActionPanel();
    document.body.appendChild(elem);
    cap = document.querySelector('ids-contextual-action-panel');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    cap = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsContextualActionPanel();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-contextual-action-panel').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(cap.outerHTML).toMatchSnapshot();
    cap.show();
    expect(cap.outerHTML).toMatchSnapshot();

    cap.hide();
    expect(cap.outerHTML).toMatchSnapshot();
  });

  it('responds to its normal buttons\' clicks', async () => {
    // Insert a header toolbar
    cap.insertAdjacentHTML('afterbegin', `<ids-toolbar slot="toolbar">
      <ids-toolbar-section type="title">
        <ids-text font-size="20" type="h2">Company Information</ids-text>
      </ids-toolbar-section>

      <ids-toolbar-section type="buttonset" align="end">
        <ids-button id="btn-save" icon="save" no-padding>
          <ids-text font-weight="bold">Save</ids-text>
        </ids-button>
        <ids-separator vertical="true"></ids-separator>
        <ids-button id="btn-close" icon="close" no-padding>
          <ids-text font-weight="bold">Close</ids-text>
        </ids-button>
      </ids-toolbar-section>
    </ids-toolbar>`);

    // Setup a button click handler
    cap.popup.animated = false;
    cap.onButtonClick = () => { cap.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the CAP
    await cap.show();
    await wait(310);

    // Click the first CAP button. The above handler should fire.
    cap.querySelector('#btn-save').dispatchEvent(clickEvent);
    await wait(310);

    expect(cap.visible).toBeFalsy();
  });
});
