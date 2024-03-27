/**
 * @jest-environment jsdom
 */
import IdsHidden from '../../src/components/ids-hidden/ids-hidden';
import IdsContainer from '../../src/components/ids-container/ids-container';

const DEFAULT_HIDDEN_HTML = (
  `<ids-hidden hide-up="sm" visible="true"></ids-hidden>`
);

const DEFAULT_HIDDEN_2_HTML = (
  `<ids-hidden hide-down="sm" hidden></ids-hidden>`
);

describe('IdsHidden Component', () => {
  let el: any;
  let container: any;
  let hidden1: any;
  let hidden2: any;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });

  const createElemViaTemplate1 = async (innerHTML: string) => {
    hidden1?.remove?.();
    container = new IdsContainer();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    hidden1 = template.content.childNodes[0];
    container.appendChild(hidden1);
    document.body.appendChild(container);


    return hidden1;
  };

  const createElemViaTemplate2 = async (innerHTML: string) => {
    hidden2?.remove?.();
    container = new IdsContainer();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    hidden2 = template.content.childNodes[0];
    container.appendChild(hidden2);
    document.body.appendChild(container);


    return hidden2;
  };

  test('renders from HTML Template with no errors', async () => {
    hidden1 = await createElemViaTemplate1(DEFAULT_HIDDEN_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-hidden').length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  test('renders from HTML Template 2 with no errors', async () => {
    hidden2 = await createElemViaTemplate2(DEFAULT_HIDDEN_2_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-hidden').length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
    const elem: any = new IdsHidden();
    document.body.appendChild(elem);
    el = document.querySelector('ids-hidden');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
    (<any>window.requestAnimationFrame).mockRestore();
  });

  test('should hide when media query matches', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({ matches: true }))
    });

    const mq = window.matchMedia('(min-width: 0px)');
    el.checkScreen(mq);
    expect(el.hidden).toBeTruthy();
    expect(el.visible).toBeFalsy();
  });
});
