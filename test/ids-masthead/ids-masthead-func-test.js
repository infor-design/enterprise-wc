/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import IdsMasthead from '../../src/components/ids-masthead/ids-masthead';

describe('IdsMasthead Component', () => {
  let element;
  let sections;

  beforeEach(async () => {
    const masthead = new IdsMasthead();
    masthead.icon = 'logo';
    masthead.title = 'title';
    masthead.innerHTML = `
      <nav slot="start"><ids-button>start nav</ids-button></nav>
      <nav slot="center"><ids-menu-button>center nav</ids-button></nav>
      <nav slot="end"><ids-button>end nav</ids-button></nav>
    `;

    document.body.appendChild(masthead);
    element = document.querySelector('ids-masthead');
    sections = element.elements.sections;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-masthead').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    element.remove();
    element = new IdsMasthead();
    document.body.appendChild(element);
    expect(document.querySelectorAll('ids-masthead').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    element.logo = '';
    element.title = '';
    expect(element.outerHTML).toMatchSnapshot();

    element.icon = 'info';
    expect(element.outerHTML).toMatchSnapshot();

    element.icon = 'logo';
    element.title = 'Infor Application';
    expect(element.outerHTML).toMatchSnapshot();
  });

  it('renders any icon', () => {
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

  it('renders logo', () => {
    element.setAttribute('icon', '');
    expect(element.icon).toBe('');

    element.icon = 'logo';
    expect(element.icon).toBe('logo');
    expect(element.getAttribute('icon')).toBe('logo');
    expect(element.template()).toMatchSnapshot();
  });

  it('renders clickable logo', () => {});

  it('renders title', () => {
    element.setAttribute('title', '');
    expect(element.title).toBe('');
    element.title = 'Info Application';
    expect(element.title).toBe('Info Application');
    expect(element.getAttribute('title')).toBe('Info Application');
    expect(element.template()).toMatchSnapshot();
  });

  it('restyles buttons to be square and transparent', () => {
    const buttons = element.querySelectorAll('ids-button, ids-menu-button');
    buttons.forEach((button) => {
      expect(button.colorVariant).toBe('alternate');
      expect(button.square).toBe(true);
      expect(button.type).toBe('default');
    });
  });

  it('has breakpoints', () => {
    expect(element.breakpoints.mobile).toBeDefined();
    expect(element.breakpoints.tablet).toBeDefined();
    expect(element.breakpoints.desktop).toBeDefined();

    expect(element.breakpoints.mobile.addEventListener).toHaveBeenCalled();
    expect(element.breakpoints.tablet.addEventListener).toHaveBeenCalled();
    expect(element.breakpoints.desktop.addEventListener).toHaveBeenCalled();

    expect(global.matchMedia).toHaveBeenCalled();
  });

  it('renders breakpoint: desktop', () => {
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

  it('renders breakpoint: tablet', () => {
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

  it('renders breakpoint: mobile', () => {
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
