/**
 * @jest-environment jsdom
 */
import IdsTabs, { IdsTab } from '../../src/ids-tabs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('IdsTabs Tests', () => {
  let elem;

  const createElemViaTemplate = (innerHTML) => {
    elem?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);
    return elem;
  };

  beforeEach(async () => {
    elem = createElemViaTemplate(
      `<ids-tabs value="hello">
        <ids-tab value="hello">Hello</ids-tab>
        <ids-tab value="world">World</ids-tab>
      </ids-tabs>`
    );

    // fix JSDOM shadowRoot issue
    await wait(100);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders from HTML Template with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
  });
});
