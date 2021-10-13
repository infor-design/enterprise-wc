/**
 * @jest-environment jsdom
 */
import IdsImage from '../../src/components/ids-image';

const name = 'ids-image';
const alt = 'example alt';
const src = 'http://via.placeholder.com/60.jpeg';
const size = 'sm';

describe('IdsImage Component (using properties)', () => {
  let component;

  beforeEach(async () => {
    component = new IdsImage();
    component.src = src;
    component.alt = alt;
    component.size = size;

    document.body.appendChild(component);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(component.outerHTML).toMatchSnapshot();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.src).toEqual(src);
    expect(component.alt).toEqual(alt);
    expect(component.size).toEqual(size);
  });

  it('should set size auto as default', () => {
    component.size = null;

    expect(component.size).toEqual('auto');

    component.size = 'md';

    expect(component.size).toEqual('md');

    component.size = 'none';

    expect(component.size).toEqual('auto');
  });
});

describe('IdsImage Component (using attributes)', () => {
  let component;

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

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.src).toEqual(src);
    expect(component.alt).toEqual(alt);
    expect(component.size).toEqual(size);
    expect(component.fallback).toBeTruthy();
  });

  it('should set size auto as default', () => {
    component.size = null;

    expect(component.size).toEqual('auto');

    component.size = 'md';

    expect(component.size).toEqual('md');

    component.size = 'none';

    expect(component.size).toEqual('auto');
  });

  it('img has src and alt attributes', () => {
    expect(component.shadowRoot.querySelector('img')?.getAttribute('src')).toEqual(src);
    expect(component.shadowRoot.querySelector('img')?.getAttribute('alt')).toEqual(alt);
  });

  it('can change src, alt and fallback attributes', () => {
    const newSrc = 'http://via.placeholder.com/80.jpeg';
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
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-image></ids-image>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have default properties', () => {
    expect(component.size).toEqual('auto');
  });

  it('should render placeholder', () => {
    expect(component.shadowRoot.querySelector('.placeholder')).toBeTruthy();
  });

  it('should render image after src changed', () => {
    component.src = src;

    expect(component.shadowRoot.querySelector('.placeholder')).toBeFalsy();
    expect(component.shadowRoot.querySelector('img')).toBeTruthy();
  });
});

describe('IdsImage Component (round and statuses)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend',
      `<ids-image src="${src}" alt="${alt}" round="true"></ids-image>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have round attribute', () => {
    expect(component.round).toBeTruthy();
    expect(component.getAttribute('round')).toEqual('true');
  });

  it('should change round attribute', () => {
    component.round = null;

    expect(component.getAttribute('round')).toBeNull();

    component.round = true;

    expect(component.getAttribute('round')).toEqual('true');
  });
});
