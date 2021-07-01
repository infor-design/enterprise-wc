/**
 * @jest-environment jsdom
 */
import { stringUtils } from '../../src/ids-base/ids-string-utils';
import processAnimFrame from '../helpers/process-anim-frame';
import IdsLoadingIndicator from '../../src/ids-loading-indicator';

const expectElemFlagBehavior = (elem, attribute, initialValue = false) => {
  const camelCasedAttrib = stringUtils.camelCase(attribute);

  expect(elem[camelCasedAttrib]).toEqual(initialValue);

  elem[camelCasedAttrib] = true;
  expect(elem[camelCasedAttrib]).toEqual(true);

  elem.removeAttribute(attribute);
  expect(elem[camelCasedAttrib]).toEqual(false);

  elem.setAttribute(attribute, 'true');
  expect(elem.hasAttribute(attribute)).toEqual(true);

  elem.removeAttribute(attribute);
  expect(elem[camelCasedAttrib]).toEqual(false);

  elem.setAttribute(attribute, '');
  expect(elem[camelCasedAttrib]).toEqual(true);

  elem[camelCasedAttrib] = false;
  expect(elem.hasAttribute(attribute)).toEqual(false);
};

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

    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders linear/indeterminate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      '<ids-loading-indicator linaer />'
    );

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders linear/determinate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      '<ids-loading-indicator linear />'
    );

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders sticky/indeterminate indicator without error', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      '<ids-loading-indicator sticky />'
    );

    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('sets and gets the progress attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator progress="30" />'
    );

    expect(elem.progress).toEqual(30);

    elem.progress = '90';
    expect(elem.progress).toEqual(90);

    elem.progress = null;
    expect(elem.progress).toEqual(undefined);
  });

  it('sets and gets the sticky attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );

    expectElemFlagBehavior(elem, 'sticky');
  });

  it('sets and gets the linear attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );

    expectElemFlagBehavior(elem, 'linear');
  });

  it('sets and gets the inline attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );

    expectElemFlagBehavior(elem, 'inline');
  });

  it('sets the sticky attribute after setting the linear but becomes only sticky', async () => {
    elem = await createElemViaTemplate('<ids-loading-indicator linear />');

    elem.sticky = true;

    expect(elem.hasAttribute('linear')).toEqual(false);
  });

  it('calls type getter reliably based on flags set', async () => {
    elem = await createElemViaTemplate('<ids-loading-indicator linear />');
    expect(elem.type).toEqual('linear');

    elem.setAttribute('sticky', true);
    expect(elem.type).toEqual('sticky');

    elem.removeAttribute('sticky');
    expect(elem.type).toEqual('circular');
  });

  it('sets and gets the percentage-visible attribute reliably', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );

    expectElemFlagBehavior(elem, 'percentage-visible');
  });

  it('supports setting mode', async () => {
    elem = await createElemViaTemplate(
      '<ids-loading-indicator />'
    );
    elem.mode = 'dark';
    expect(elem.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    elem.version = 'classic';
    expect(elem.getAttribute('version')).toEqual('classic');
  });
});
