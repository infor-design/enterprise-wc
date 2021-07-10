/**
 * @jest-environment jsdom
 */
import testElemBuilderFactory from '../helpers/test-elem-builder-factory';
// import IdsSplitter from '../../src/ids-splitter';

const elemBuilder = testElemBuilderFactory();

describe('IdsSplitter Component', () => {
  afterAll(async () => { elemBuilder.clearElement(); });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    await elemBuilder.createElemFromTemplate('<ids-splitter></ids-splitter>');
    expect(errors).not.toHaveBeenCalled();
  });
});
