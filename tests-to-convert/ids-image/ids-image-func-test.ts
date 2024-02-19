/**
 * @jest-environment jsdom
 */
import IdsImage from '../../src/components/ids-image/ids-image';

const name = 'ids-image';
const alt = 'example alt';
const src = '../assets/images/placeholder-60x60.png';
const newSrc = '../assets/images/placeholder-154x120.png';
const size = 'sm';

describe('IdsImage Component (using properties)', () => {
  let component: IdsImage;

  beforeEach(async () => {
    component = new IdsImage();

    // TODO Changing the order causes errors to be fixed
    document.body.appendChild(component);
    component.src = src;
    component.alt = alt;
    component.size = size;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    (component as any) = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(component.outerHTML).toMatchSnapshot();
  });

  test('has properties', () => {
    expect(component.src).toEqual(src);
    expect(component.alt).toEqual(alt);
    expect(component.size).toEqual(size);
  });

  test('should set size auto as default', () => {
    component.size = null;

    expect(component.size).toEqual('auto');

    component.size = 'md';

    expect(component.size).toEqual('md');

    component.size = 'none';

    expect(component.size).toEqual('auto');
  });
});

describe('IdsImage Component (using attributes)', () => {
  let component: any;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `
      <ids-image src="${src}" alt="${alt}" size="${size}" fallback="true"></ids-image>
    `);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  test('has properties', () => {
    expect(component.src).toEqual(src);
    expect(component.alt).toEqual(alt);
    expect(component.size).toEqual(size);
    expect(component.fallback).toBeTruthy();
  });

  test('should set size auto as default', () => {
    component.size = null;
    expect(component.size).toEqual('auto');
    component.size = 'md';
    expect(component.size).toEqual('md');
    component.size = 'none';
    expect(component.size).toEqual('auto');
  });

  test('img has src attributes', () => {
    expect(component.shadowRoot.querySelector('img')?.getAttribute('src')).toEqual(src);
  });

  test('can change src, alt and fallback attributes', () => {
    const newAlt = 'alt updated';

    component.src = newSrc;
    component.alt = newAlt;
    component.fallback = false;

    expect(component.getAttribute('fallback')).toBeNull();

    expect(component.shadowRoot.querySelector('img')?.getAttribute('src')).toEqual(newSrc);
    expect(component.shadowRoot.querySelector('img')?.getAttribute('alt')).toEqual(newAlt);

    component.alt = null;

    expect(component.shadowRoot.querySelector('img')?.getAttribute('alt')).toBeNull();
  });
});

describe('IdsImage Component (empty)', () => {
  let component: any;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-image></ids-image>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  test('should have default properties', () => {
    expect(component.size).toEqual('auto');
  });

  test('should render placeholder', () => {
    expect(component.shadowRoot.querySelector('.placeholder')).toBeTruthy();
  });

  test('should render image after src changed', () => {
    component.src = src;

    expect(component.shadowRoot.querySelector('.placeholder')).toBeFalsy();
    expect(component.shadowRoot.querySelector('img')).toBeTruthy();
  });
});

describe('IdsImage Component (round and statuses)', () => {
  let component: any;

  beforeEach(async () => {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<ids-image src="${src}" alt="${alt}" round="true" user-status="available"></ids-image>`
    );
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  test('should have attributes', () => {
    expect(component.round).toBeTruthy();
    expect(component.getAttribute('round')).toEqual('true');

    expect(component.userStatus).toEqual('available');
    expect(component.getAttribute('user-status')).toEqual('available');
  });

  test('should change attributes', () => {
    component.round = null;
    expect(component.getAttribute('round')).toBeNull();

    component.round = true;
    expect(component.getAttribute('round')).toEqual('true');

    component.userStatus = null;
    expect(component.getAttribute('user-status')).toBeNull();

    component.userStatus = 'away';
    expect(component.getAttribute('user-status')).toEqual('away');
  });

  test('should change to initials', () => {
    component.initials = 'mn';

    expect(component.getAttribute('initials')).toEqual('mn');

    expect(component.shadowRoot.querySelector('img')).toBeFalsy();
    expect(component.shadowRoot.querySelector('.initials')).toBeTruthy();
  });

  test('should render initials and back to placeholder', () => {
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML(
      'beforeend',
      `<ids-image round="true" initials="long"></ids-image>`
    );
    component = document.querySelector(name);

    expect(component.getAttribute('initials')).toEqual('long');
    expect(component.shadowRoot.querySelector('.initials')).toBeTruthy();

    component.initials = null;
    expect(component.getAttribute('initials')).toBeNull();
    expect(component.shadowRoot.querySelector('.placeholder')).toBeTruthy();
  });
});
