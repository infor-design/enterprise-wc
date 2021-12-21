/**
 * @jest-environment jsdom
 */
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import processAnimFrame from '../helpers/process-anim-frame';
import IdsLoadingIndicator from '../../src/components/ids-loading-indicator/ids-loading-indicator';

describe('IdsLoadingIndicator Component', () => {
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
    elem.remove();
  });

  it('renders circular/indeterminate (default) with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate('<ids-loading-indicator></ids-loading-indicator>');

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders circular/determinate with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate('<ids-loading-indicator progress="45" percentage-visible></ids-loading-indicator>');

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders linear/indeterminate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate('<ids-loading-indicator linear></ids-loading-indicator>');

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders linear/determinate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate('<ids-loading-indicator linear progress="45" percentage-visible></ids-loading-indicator>');

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders sticky/indeterminate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate('<ids-loading-indicator sticky></ids-loading-indicator>');

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('sets and gets the progress attribute reliably', async () => {
    elem = await createElemViaTemplate('<ids-loading-indicator progress="30"></ids-loading-indicator>');

    expect(elem.progress).toEqual(30);

    elem.progress = '90';
    expect(elem.progress).toEqual(90);

    elem.progress = null;
    expect(elem.progress).toEqual(undefined);
  });

  it('sets and gets the sticky attribute reliably', async () => {
    elem = await createElemViaTemplate('<ids-loading-indicator></ids-loading-indicator>');

    expectFlagAttributeBehavior({ elem, attribute: 'sticky' });
  });

  it('sets and gets the linear attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator></ids-loading-indicator>'
    );

    expectFlagAttributeBehavior({ elem, attribute: 'linear' });
  });

  it('sets and gets the inline attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator inline></ids-loading-indicator>'
    );

    expectFlagAttributeBehavior({ elem, attribute: 'inline' });
  });

  it('calls type getter reliably based on flags set', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator linear></ids-loading-indicator>'
    );
    expect(elem.type).toEqual('linear');

    elem.setAttribute('sticky', true);
    expect(elem.type).toEqual('sticky');

    elem.removeAttribute('sticky');
    expect(elem.type).toEqual('circular');
  });

  it('sets and gets the percentage-visible attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator sticky percentage-visible></ids-loading-indicator>'
    );

    expectFlagAttributeBehavior({ elem, attribute: 'percentage-visible' });
  });

  it('supports setting mode', async () => {
    elem = await createElemViaTemplate('<ids-loading-indicator></ids-loading-indicator>');
    elem.mode = 'dark';
    expect(elem.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    elem.version = 'classic';
    expect(elem.getAttribute('version')).toEqual('classic');
  });
});
