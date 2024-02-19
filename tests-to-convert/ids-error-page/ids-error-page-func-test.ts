/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import IdsErrorPage from '../../src/components/ids-error-page/ids-error-page';

describe('Ids Error Page Tests', () => {
  let errorPage: any;

  beforeEach(async () => {
    const elem: any = new IdsErrorPage();
    document.body.appendChild(elem);
    errorPage = document.querySelector('ids-error-page');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('can set the error icon', () => {
    const iconId = 'empty-error-loading';

    errorPage.icon = iconId;
    errorPage.setAttribute('icon', iconId);
    expect(errorPage.icon).toBe(iconId);
    expect(errorPage.getAttribute('icon')).toBe(iconId);

    errorPage.icon = null;
    errorPage.removeAttribute('icon');
    expect(errorPage.icon).toBe(null);
    expect(errorPage.getAttribute('icon')).toBe(null);
  });

  test('can set the label', () => {
    const labelText = 'Error Alert';

    errorPage.label = labelText;
    errorPage.setAttribute('label', labelText);

    expect(errorPage.label).toBe(labelText);
    expect(errorPage.getAttribute('label')).toBe(labelText);

    errorPage.label = null;
    errorPage.removeAttribute('label');
    expect(errorPage.label).toBe(null);
    expect(errorPage.getAttribute('label')).toBe(null);
  });

  test('can set the description', () => {
    const descriptionText = 'Test Description';

    errorPage.description = descriptionText;
    errorPage.setAttribute('description', descriptionText);
    expect(errorPage.description).toBe(descriptionText);
    expect(errorPage.getAttribute('description')).toBe(descriptionText);

    errorPage.description = null;
    errorPage.removeAttribute('description');
    expect(errorPage.description).toBe(null);
    expect(errorPage.getAttribute('description')).toBe(null);
  });

  test('can set the buttonText', () => {
    const defaultButtonText = 'Return';

    errorPage.buttonText = defaultButtonText;
    errorPage.setAttribute('buttonText', defaultButtonText);
    expect(errorPage.buttonText).toBe(defaultButtonText);
    expect(errorPage.getAttribute('buttonText')).toBe(defaultButtonText);

    errorPage.buttonText = null;
    errorPage.removeAttribute('buttonText');
    expect(errorPage.buttonText).toBe(null);
    expect(errorPage.getAttribute('buttonText')).toBe(null);
  });

  test('can trigger the action-button event on click', async () => {
    const button = errorPage.shadowRoot.querySelector('[slot="button"]');
    const event = new MouseEvent('click', {
      button: 1,
      screenX: 0,
      screenY: 0,
      buttons: button,
      bubbles: true,
      cancelable: true,
      view: window
    });

    button.dispatchEvent(event);
    expect(errorPage.getAttribute('visible')).toBe(null);
  });

  test('can trigger the action-button event on touchend', async () => {
    const button = errorPage.shadowRoot.querySelector('[slot="button"]');
    const event = new TouchEvent('touchend', {
      touches: [{
        identifier: 123,
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        force: 0,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0,
        target: button
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });

    button.dispatchEvent(event);
    expect(errorPage.getAttribute('visible')).toBe(null);
  });
});
