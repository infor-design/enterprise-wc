/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import IdsMasthead from '../../src/components/ids-masthead/ids-masthead';
import type IdsButton from '../../src/components/ids-button/ids-button';
import type IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';

describe('IdsMasthead Component', () => {
  let element: IdsMasthead;
  let sections: any;

  beforeEach(async () => {
    const masthead = new IdsMasthead();
    masthead.icon = 'logo';
    masthead.title = 'title';
    masthead.innerHTML = `
      <section slot="start"><ids-button>start section</ids-button></section>
      <section slot="center"><ids-menu-button>center section</ids-button></section>
      <section slot="end"><ids-button>end section</ids-button></section>
    `;

    document.body.appendChild(masthead);
    element = document.querySelector('ids-masthead') as IdsMasthead;
    sections = element.elements.sections;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders any icon', () => {
    element.setAttribute('icon', '');
    expect(element.icon).toBe('');

    element.icon = 'info';
    expect(element.icon).toBe('info');
    expect(element.getAttribute('icon')).toBe('info');
    expect(element.template()).toMatchSnapshot();

    element.icon = 'user';
    expect(element.icon).toBe('user');
    expect(element.getAttribute('icon')).toBe('user');
    expect(element.template()).toMatchSnapshot();
  });

  test('renders and updates logo', () => {
    const ICON1 = 'logo';
    const ICON2 = 'star-outlined';
    element.setAttribute('icon', '');
    expect(element.icon).toBe('');

    element.icon = ICON1;
    expect(element.icon).toBe(ICON1);
    expect(element.getAttribute('icon')).toBe(ICON1);

    let logo = element.shadowRoot?.querySelector('#logo');
    expect(logo?.id).toBe('logo');
    expect(logo?.classList.contains(`icon-${ICON1}`)).toBe(true);
    expect(element.template()).toMatchSnapshot();

    element.icon = ICON2;
    expect(element.icon).toBe(ICON2);
    expect(element.getAttribute('icon')).toBe(ICON2);

    logo = element.shadowRoot?.querySelector('#logo');
    expect(logo?.id).toBe('logo');
    expect(logo?.classList.contains(`icon-${ICON2}`)).toBe(true);
    expect(element.template()).toMatchSnapshot();
  });

  it.skip('renders clickable logo', () => { });

  test('renders and updates title', () => {
    element.setAttribute('title', '');
    expect(element.title).toBe('');

    element.title = 'Infor Application';
    expect(element.title).toBe('Infor Application');
    expect(element.getAttribute('title')).toBe('Infor Application');
    expect(element.shadowRoot?.innerHTML).toContain('Infor Application');
    expect(element.template()).toMatchSnapshot();
  });

  test('restyles buttons to be square and transparent', () => {
    const buttons = element.querySelectorAll<IdsButton | IdsMenuButton>('ids-button, ids-menu-button');
    buttons.forEach((button) => {
      expect(button.colorVariant).toBe('alternate');
      expect(button.appearance).toBe('default');
    });
  });

  test('has breakpoints', () => {
    expect(element.breakpoints.mobile).toBeDefined();
    expect(element.breakpoints.tablet).toBeDefined();
    expect(element.breakpoints.desktop).toBeDefined();

    expect(element.breakpoints.mobile.addEventListener).toHaveBeenCalled();
    expect(element.breakpoints.tablet.addEventListener).toHaveBeenCalled();
    expect(element.breakpoints.desktop.addEventListener).toHaveBeenCalled();

    expect(global.matchMedia).toHaveBeenCalled();
  });

  test('renders breakpoint: desktop', () => {
    jest.spyOn(element, 'isDesktop', 'get').mockReturnValue(true);
    expect(element.isDesktop).toBe(true);
    expect(element.isTablet).toBe(false);
    expect(element.isMobile).toBe(false);

    element.renderBreakpoint();
    expect(sections.start.querySelector('slot').assignedNodes()).toContain(element.slots.start);
    expect(sections.center.querySelector('slot').assignedNodes()).toContain(element.slots.center);
    expect(sections.end.querySelector('slot').assignedNodes()).toContain(element.slots.end);

    expect(sections.more.querySelector('slot').assignedNodes()).toEqual([]);
  });

  test('renders breakpoint: tablet', () => {
    jest.spyOn(element, 'isTablet', 'get').mockReturnValue(true);
    expect(element.isTablet).toBe(true);
    expect(element.isDesktop).toBe(false);
    expect(element.isMobile).toBe(false);

    element.renderBreakpoint();
    expect(sections.start.querySelector('slot').assignedNodes()).toContain(element.slots.start);
    expect(sections.center.querySelector('slot').assignedNodes()).toEqual([]);
    expect(sections.end.querySelector('slot').assignedNodes()).toEqual([]);

    expect(sections.more.querySelector('slot').assignedNodes()).toContain(element.slots.center);
    expect(sections.more.querySelector('slot').assignedNodes()).toContain(element.slots.end);
  });

  test('renders breakpoint: mobile', () => {
    jest.spyOn(element, 'isMobile', 'get').mockReturnValue(true);
    expect(element.isMobile).toBe(true);
    expect(element.isDesktop).toBe(false);
    expect(element.isTablet).toBe(false);

    element.renderBreakpoint();
    expect(sections.start.querySelector('slot').assignedNodes()).toEqual([]);
    expect(sections.center.querySelector('slot').assignedNodes()).toEqual([]);
    expect(sections.end.querySelector('slot').assignedNodes()).toEqual([]);

    expect(sections.more.querySelector('slot').assignedNodes()).toContain(element.slots.start);
    expect(sections.more.querySelector('slot').assignedNodes()).toContain(element.slots.center);
    expect(sections.more.querySelector('slot').assignedNodes()).toContain(element.slots.end);
  });
});
