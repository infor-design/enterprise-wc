/**
 * @jest-environment jsdom
 */
import IdsPager from '../../src/ids-pager/ids-pager';

const DEFAULT_PAGER_HTML = (
  `<ids-pager>
    test content
  </ids-pager>`
);

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

describe('IdsPager Component', () => {
  let elem;

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    await processAnimFrame();

    return elem;
  };

  afterEach(async () => {
    elem?.remove();
  });

  it('renders with no errors', () => {
    it('renders from HTML Template with no errors', async () => {
      elem = await createElemViaTemplate(DEFAULT_PAGER_HTML);

      const errors = jest.spyOn(global.console, 'error');
      expect(document.querySelectorAll('ids-tabs').length).toEqual(1);
      expect(errors).not.toHaveBeenCalled();
    });
  });
});
