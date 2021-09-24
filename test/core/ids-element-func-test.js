/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/components/ids-tag/ids-tag';
import { IdsElement } from '../../src/core/ids-element';
import styleMock from '../helpers/style-mock';

describe('IdsElement Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('detaches an invalid event name without affecting existing events', () => {
    const elem = new IdsTag();
    const prevHandledEventsSize = elem.handledEvents.size;
    elem.detachEventsByName(123);
    expect(elem.handledEvents.size).toEqual(prevHandledEventsSize);
  });

  it('skips render if no template', () => {
    const elem = new IdsTag();
    elem.template = null;

    const mockCallback = jest.fn();
    elem.rendered = mockCallback;
    elem.render();
    expect(mockCallback.mock.calls.length).toBe(0);
  });
});
