/**
 * @jest-environment jsdom
 */
import IdsDraggable from '../../src/components/ids-draggable';
import { IdsStringUtils } from '../../src/utils';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import simulateMouseDownEvents from '../helpers/simulate-mouse-down-events';
import elemBuilderFactory from '../helpers/elem-builder-factory';
import processAnimFrame from '../helpers/process-anim-frame';

const elemBuilder = elemBuilderFactory();

describe('IdsDraggable Component', () => {
  /**
   * @param {string} outerHTML HTML for ids-draggable
   * @returns {IdsDraggable} draggable with a container
   * attached that was added to the DOM
   */
  async function createContainedDraggable(outerHTML) {
    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    const elem = await elemBuilder.createElemFromTemplate(
      outerHTML,
      container
    );
    document.body.appendChild(elem);

    return elem;
  }

  beforeAll(async () => {
    const idsDraggable = new IdsDraggable();
    document.body.appendChild(idsDraggable);
  });

  afterAll(async () => { elemBuilder.clearElement(); });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );
    await elemBuilder.clearElement();

    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`,
      container
    );
    await elemBuilder.clearElement();

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable axis="x">
        <div>x</div>
      </ids-draggable>`,
      container
    );
    await elemBuilder.clearElement();

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable axis="y">
        <div>y</div>
      </ids-draggable>`,
      container
    );
    await elemBuilder.clearElement();

    expect(errors).not.toHaveBeenCalled();
  });

  it('can set/get the axis attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    elem.setAttribute('axis', 'x');
    expect(elem.getAttribute('axis')).toEqual('x');

    await expectEnumAttributeBehavior({
      elem,
      attribute: 'axis',
      values: ['x', 'y'],
      defaultValue: null
    });
  });

  it('can set/get the handle attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable handle=".handle">
        <div class="handle">draggable</div>
      </ids-draggable>`
    );

    elem.handle = null;
    expect(elem.getAttribute('handle')).toEqual(null);

    elem.handle = '.handle';
    expect(elem.getAttribute('handle')).toEqual('.handle');

    elem.handle = '.handle';
    expect(elem.getAttribute('handle')).toEqual('.handle');
  });

  it('can set/get the is-dragging attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'is-dragging' });
    await elemBuilder.clearElement();
  });

  it('can set/get the disabled attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'disabled' });
  });

  it('can set/get the parent-containment attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'parent-containment' });
  });

  it('has mouse down then up on draggable, and then the is-dragging attribute reacts properly', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    let hasDraggingBeenSet = false;

    Object.defineProperty(elem, 'isDragging', {
      get: jest.fn(),
      set: jest.fn((v) => {
        const isTruthy = IdsStringUtils.stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(hasDraggingBeenSet).toBeTruthy();
  });

  it('has mouse down then up on draggable, and then the is-dragging attribute reacts properly', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    let hasDraggingBeenSet = false;

    Object.defineProperty(elem, 'isDragging', {
      get: jest.fn(),
      set: jest.fn((v) => {
        const isTruthy = IdsStringUtils.stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(hasDraggingBeenSet).toBeTruthy();
  });

  it('begins drag and no errors are thrown', async () => {
    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`,
      container
    );

    document.body.appendChild(elem);

    await processAnimFrame();
    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
  });

  it('sets max-transform-x value predictably', async () => {
    const elem = await createContainedDraggable(
      `<ids-draggable parent-containment max-transform-x='80'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('max-transform-x')).toEqual('80');

    elem.setAttribute('max-transform-x', 0);
    await processAnimFrame();
    expect(elem.getAttribute('max-transform-x')).toEqual('0');
    expect(elem.maxTransformX).toEqual(0);
  });

  it('sets min-transform-x value predictably', async () => {
    const elem = await createContainedDraggable(
      `<ids-draggable parent-containment min-transform-x='-20'>
        <div>draggable</div>
      </ids-draggable>`
    );

    expect(elem.getAttribute('min-transform-x')).toEqual('-20');

    elem.setAttribute('min-transform-x', 0);
    await processAnimFrame();
    expect(elem.getAttribute('min-transform-x')).toEqual('0');
    expect(elem.minTransformX).toEqual(0);
  });

  it('sets max-transform-y value predictably', async () => {
    const elem = await createContainedDraggable(
      `<ids-draggable parent-containment max-transform-y='-20'>
        <div>draggable</div>
      </ids-draggable>`
    );

    expect(elem.getAttribute('max-transform-y')).toEqual('-20');
    elem.setAttribute('max-transform-y', 0);
    await processAnimFrame();
    expect(elem.getAttribute('max-transform-y')).toEqual('0');
    expect(elem.maxTransformY).toEqual(0);
  });

  it('sets min-transform-y value predictably', async () => {
    const elem = await createContainedDraggable(
      `<ids-draggable parent-containment min-transform-y='-20'>
      <div>draggable</div>
    </ids-draggable>`
    );
    expect(elem.getAttribute('min-transform-y')).toEqual('-20');

    elem.setAttribute('min-transform-y', '0');
    await processAnimFrame();
    expect(elem.getAttribute('min-transform-y')).toEqual('0');
    expect(elem.minTransformY).toEqual(0);
  });

  it('expects transform values to be predictable when not set', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable parent-containment>
      <div>draggable</div>
    </ids-draggable>`
    );

    expect(elem.minTransformX).toBeNull();
    expect(elem.minTransformY).toBeNull();
    expect(elem.maxTransformX).toBeNull();
    expect(elem.maxTransformY).toBeNull();
  });
});
