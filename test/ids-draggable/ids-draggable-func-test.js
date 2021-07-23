/**
 * @jest-environment jsdom
 */
import IdsDraggable from '../../src/ids-draggable';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import expectFlagAttributeBehavior from '../helpers/expect-flag-attribute-behavior';
import testElemBuilderFactory from '../helpers/test-elem-builder-factory';

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
    elemBuilder.clearElement();

    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable parent-containment>
        <div>draggable</div>
      </ids-draggable>`,
      container
    );
    elemBuilder.clearElement();

    await elemBuilder.createElemFromTemplate(
      `<ids-draggable axis="x">
        <div>x</div>
      </ids-draggable>`,
      container
    );

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

    expectEnumAttributeBehavior({
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
    await elem.clearElement();
  });

  it('can set/get the disabled attribute predictably', async () => {
    const elem = await elemBuilder.createElemFromTemplate(
      `<ids-draggable>
        <div>draggable</div>
      </ids-draggable>`
    );

    expectFlagAttributeBehavior({ elem, attribute: 'disabled' });
  });
});
