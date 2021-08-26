/**
 * @jest-environment jsdom
 */
import IdsAppMenu from '../../src/components/ids-app-menu';
import IdsAccordion, {
  IdsAccordionHeader,
  IdsAccordionPanel
} from '../../src/components/ids-accordion';
import IdsText from '../../src/components/ids-text';

import elemBuilderFactory from '../helpers/elem-builder-factory';
import waitFor from '../helpers/wait-for';

const elemBuilder = elemBuilderFactory();

const createAppMenu = async () => elemBuilder.createElemFromTemplate(`<ids-app-menu id="app-menu">
  <img slot="avatar" src="/assets/avatar-placeholder.jpg" alt="Picture of Richard Fairbanks" />
  <ids-text slot="username" font-size="24" font-weight="bold">Richard Fairbanks</ids-text>
  <ids-accordion>
    <ids-accordion-panel id="p1">
      <ids-accordion-header id="h1" slot="header">
        <ids-text>First Pane</ids-text>
      </ids-accordion-header>
    </ids-accordion-panel>
    <ids-accordion-panel id="p2">
      <ids-accordion-header id="h2" slot="header">
        <ids-text>Second Pane</ids-text>
      </ids-accordion-header>
    </ids-accordion-panel>
    <ids-accordion-panel id="p3">
      <ids-accordion-header id="h3" slot="header">
        <ids-text>Third Pane</ids-text>
      </ids-accordion-header>
      <ids-accordion-pane slot="content" id="sp1">
        <ids-accordion-header id="sh1" slot="header">
          <ids-text>Sub-Pane 1</ids-text>
        </ids-accordion-header>
      </ids-accordion-pane>
      <ids-accordion-pane slot="content" id="sp2">
        <ids-accordion-header id="sh2" slot="header">
          <ids-text>Sub-Pane 2</ids-text>
        </ids-accordion-header>
      </ids-accordion-pane>
      <ids-accordion-pane slot="content" id="sp3">
        <ids-accordion-header id="sh3" slot="header">
          <ids-text>Sub-Pane 3</ids-text>
        </ids-accordion-header>
      </ids-accordion-pane>
    </ids-accordion-panel>
  </ids-accordion>
</ids-app-menu>`);

describe('IdsAppMenu Component (rendering)', () => {
  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    // Build and destroy an App Menu
    createAppMenu();
    await elemBuilder.clearElement();

    expect(errors).not.toHaveBeenCalled();
  });
});

describe('IdsAppMenu Component', () => {
  let appMenuElem;

  beforeEach(async () => {
    appMenuElem = await createAppMenu();
  });

  afterEach(async () => {
    elemBuilder.clearElement();
    appMenuElem = null;
  });

  it('has default settings', async () => {
    expect(appMenuElem.type).toBe('app-menu');
    expect(appMenuElem.edge).toBe('start');
  });

  it('should convert inner accordions to use the "app-menu" color variant', async () => {
    const acc = appMenuElem.querySelector('ids-accordion');
    waitFor(() => expect(acc.colorVariant).toBe('app-menu'));
  });
});
