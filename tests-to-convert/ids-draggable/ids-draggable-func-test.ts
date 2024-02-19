/**
 * @jest-environment jsdom
 */
import IdsDraggable from '../../src/components/ids-draggable/ids-draggable';
import { stringToBool } from '../../src/utils/ids-string-utils/ids-string-utils';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import simulateMouseDownEvents from '../helpers/simulate-mouse-down-events';
import createFromTemplate from '../helpers/create-from-template';
import getElTranslatePoint from '../../src/components/ids-draggable/get-el-translate-point';

describe('IdsDraggable Component', () => {
  let draggable: IdsDraggable;

  beforeAll(async () => {
    const idsDraggable: IdsDraggable = new IdsDraggable();
    draggable = new IdsDraggable();
    document.body.appendChild(idsDraggable);
  });

  test('can set/get the axis attribute predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
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

  test('can set/get the handle attribute predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
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

  test('can set/get the is-dragging attribute predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'is-dragging' });
  });

  test('can set/get the disabled attribute predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'disabled' });
  });

  test('can set/get the parent-containment attribute predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'parent-containment' });
  });

  test('has mouse down then up on draggable, and then the is-dragging attribute reacts properly', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    let hasDraggingBeenSet = false;

    Object.defineProperty(elem, 'isDragging', {
      get: jest.fn(),
      set: jest.fn((v) => {
        const isTruthy = stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(hasDraggingBeenSet).toBeTruthy();
  });

  test('has mouse down then up on draggable, and then the is-dragging attribute reacts properly', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    let hasDraggingBeenSet = false;

    Object.defineProperty(elem, 'isDragging', {
      get: jest.fn(),
      set: jest.fn((v) => {
        const isTruthy = stringToBool(v);

        if (isTruthy) {
          hasDraggingBeenSet = true;
        }
      })
    });

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(hasDraggingBeenSet).toBeTruthy();
  });

  test('ignores mouse down due to is-dragging', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    elem.isDragging = true;
    const mockCallback = jest.fn();
    elem.addEventListener('ids-dragend', mockCallback);
    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(mockCallback.mock.calls.length).toBe(0);

    elem.isDragging = false;
    const mockCallback2 = jest.fn();
    elem.addEventListener('ids-dragend', mockCallback2);
    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
    expect(mockCallback2.mock.calls.length).toBe(0);
  });

  test('begins drag and no errors are thrown', async () => {
    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`
    );

    document.body.appendChild(elem);

    await simulateMouseDownEvents({ element: elem, mouseDownTime: 100 });
  });

  test('sets max-transform-x value predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment max-transform-x='80'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('max-transform-x')).toEqual('80');

    elem.setAttribute('max-transform-x', 0);
    expect(elem.getAttribute('max-transform-x')).toEqual('0');
    expect(elem.maxTransformX).toEqual(0);
  });

  test('sets min-transform-x value predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment min-transform-x='-20'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('min-transform-x')).toEqual('-20');

    elem.setAttribute('min-transform-x', 0);
    expect(elem.getAttribute('min-transform-x')).toEqual('0');
    expect(elem.minTransformX).toEqual(0);
  });

  test('sets max-transform-y value predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment max-transform-y='-20'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('max-transform-y')).toEqual('-20');
    elem.setAttribute('max-transform-y', 0);
    expect(elem.getAttribute('max-transform-y')).toEqual('0');
    expect(elem.maxTransformY).toEqual(0);
  });

  test('sets relative-bounds value predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment relative-bounds='left: -20; right: -20'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('relative-bounds')).toEqual('left: -20; right: -20');
    expect(elem.relativeBounds).toEqual('left: -20; right: -20');

    elem.setAttribute('relative-bounds', 'top: 10; bottom: 20');
    elem.relativeBounds = 'top: 10; bottom: 20';
    expect(elem.getAttribute('relative-bounds')).toEqual('top: 10; bottom: 20');
    expect(elem.relativeBounds).toEqual('top: 10; bottom: 20');

    elem.removeAttribute('relative-bounds');
    elem.relativeBounds = null;
    expect(elem.getAttribute('relative-bounds')).toEqual(null);
    expect(elem.relativeBounds).toEqual(null);
  });

  test('sets min-transform-y value predictably', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment min-transform-y='-20'>
        <div>draggable</div>
      </ids-draggable>`
    );
    expect(elem.getAttribute('min-transform-y')).toEqual('-20');

    elem.setAttribute('min-transform-y', '0');
    expect(elem.getAttribute('min-transform-y')).toEqual('0');
    expect(elem.minTransformY).toEqual(0);
  });

  test('expects transform values to be predictable when not set', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`
    );

    expect(elem.minTransformX).toEqual(0);
    expect(elem.minTransformY).toEqual(0);
    expect(elem.maxTransformX).toEqual(0);
    expect(elem.maxTransformY).toEqual(0);
  });

  test('util getElTranslatePoint works correctly', async () => {
    const elem = document.createElement('p');
    expect(getElTranslatePoint(elem)).toEqual({ x: 0, y: 0, z: 0 });
    elem.style.transform = 'none';
    expect(getElTranslatePoint(elem)).toEqual({ x: 0, y: 0, z: 0 });
    elem.style.transform = 'matrix(1, 0, 0, 1, 114, 0)';
    expect(getElTranslatePoint(elem)).toEqual({ x: 114, y: 0, z: 0 });
    elem.style.transform = 'matrix3d(1, 0, 0, 1, 114, 0)';
    expect(getElTranslatePoint(elem)).toEqual({ x: NaN, y: NaN, z: NaN });
    elem.style.transform = 'matrix(0, 0, 0, 0, 0, 0)';
    expect(getElTranslatePoint(elem)).toEqual({ x: 0, y: 0, z: 0 });
    elem.style.transform = 'matrix4d(0, 0, 0, 0, 0, 0)';
    expect(getElTranslatePoint(elem)).toEqual({ x: 0, y: 0, z: 0 });
    elem.style.transform = 'matrix()';
    expect(getElTranslatePoint(elem)).toEqual({ x: 0, y: 0, z: 0 });
  });

  test('safely handles setting integer attributes', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment>
      <div>draggable</div>
    </ids-draggable>`
    );

    elem.minTransformX = null;
    expect(elem.getAttribute('min-transform-x')).toEqual(null);
    elem.minTransformX = undefined;
    expect(elem.getAttribute('min-transform-x')).toEqual(null);
    elem.minTransformX = [];
    expect(elem.getAttribute('min-transform-x')).toEqual(null);
    elem.minTransformX = '1';
    expect(elem.getAttribute('min-transform-x')).toEqual('1');
    elem.minTransformX = null;
    expect(elem.getAttribute('min-transform-x')).toEqual(null);
    elem.setAttribute('min-transform-x', '1');
    elem.minTransformX = null;
    expect(elem.getAttribute('min-transform-x')).toEqual(null);
  });

  test('safely handles setting handle', async () => {
    const elem = await createFromTemplate(
      draggable,
      `<ids-draggable parent-containment>
      <div>draggable</div>
    </ids-draggable>`
    );

    elem.handle = null;
    expect(elem.getAttribute('handle')).toEqual(null);
    elem.handle = '#not-existing';
    expect(elem.getAttribute('handle')).toEqual('#not-existing');
  });
});
