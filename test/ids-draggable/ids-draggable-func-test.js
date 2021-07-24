/**
 * @jest-environment jsdom
 */
import IdsDraggable from '../../src/ids-draggable';
import { stringUtils } from '../../src/ids-base/ids-string-utils';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import simulateMouseDownEvents from '../helpers/simulate-mouse-down-events';
import testElemBuilderFactory from '../helpers/test-elem-builder-factory';
import processAnimFrame from '../helpers/process-anim-frame';

const elemBuilder = testElemBuilderFactory();

describe('IdsDraggable Component', () => {
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
        const isTruthy = stringUtils.stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({
      element: elem,
      mouseDownTime: 100
    });
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
        const isTruthy = stringUtils.stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(hasDraggingBeenSet).toBeTruthy();
  });

  it('begins drag and then the parent-rect of the container gets measured', async () => {
    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`,
      container
    );

    await processAnimFrame();

    await simulateMouseDownEvents({
      element: elem,
      mouseDownTime: 100,
      callMouseMove: true
    });
  });
});
