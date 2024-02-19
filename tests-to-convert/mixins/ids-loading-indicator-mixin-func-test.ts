/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsContainer from '../../src/components/ids-container/ids-container';
import type IdsLoadingIndicator from '../../src/components/ids-loading-indicator/ids-loading-indicator';

describe('IdsLoadingIndicatorMixin Tests', () => {
  let button: IdsButton;
  let container: IdsContainer;

  beforeEach(() => {
    button = new IdsButton();
    container = new IdsContainer();
    button.innerHTML = '<span>Default Button</span>';
    document.body.appendChild(container);
    container.appendChild(button);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should change properties', () => {
    expect(button.showLoadingIndicator).toBeFalsy();
    expect(button.loadingIndicatorOnly).toBeFalsy();

    button.showLoadingIndicator = true;
    button.loadingIndicatorOnly = true;

    expect(button.showLoadingIndicator).toBeTruthy();
    expect(button.loadingIndicatorOnly).toBeTruthy();
    expect(button.getAttribute('show-loading-indicator')).toEqual('true');
    expect(button.getAttribute('loading-indicator-only')).toEqual('true');

    button.showLoadingIndicator = false;
    button.loadingIndicatorOnly = false;

    expect(button.showLoadingIndicator).toBeFalsy();
    expect(button.loadingIndicatorOnly).toBeFalsy();
    expect(button.getAttribute('show-loading-indicator')).toBeNull();
    expect(button.getAttribute('loading-indicator-only')).toBeNull();
  });

  test('should toggle visibility with properties', () => {
    const getElement = () => button.querySelector<IdsLoadingIndicator>('ids-loading-indicator');
    expect(getElement()).toBeNull();

    button.showLoadingIndicator = true;

    expect(getElement()).not.toBeNull();
    expect(getElement()?.classList.contains('slot-loading-indicator')).toBeTruthy();
  });
});
