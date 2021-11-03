/**
 * @jest-environment jsdom
 */
import { IdsDeviceEnvUtils } from '../../src/utils';

describe('IdsDeviceEnvUtils Tests', () => {
  let specs;

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'userAgentData', {
      value: { platform: 'macOS' },
    });
  });

  beforeEach(async () => {
    specs = IdsDeviceEnvUtils.getSpecs();
  });

  afterEach(async () => {
    specs = null;
  });

  it('should initialize without an errors', () => {
    expect(specs).toBeDefined();
  });

  it('should type check', () => {
    expect(typeof specs.currentBrowser).toBe('string');
    expect(typeof specs.browserVersion).toBe('string');
    expect(typeof specs.browserMajorVersion).toBe('string');
    expect(typeof specs.isMobile).toBe('boolean');
    expect(typeof specs.os).toBe('string');
    expect(typeof specs.platform).toBe('string');
    expect(typeof specs.currentOSVersion).toBe('string');
    expect(typeof specs.browserLanguage).toBe('string');
    expect(typeof specs.idsVersion).toBe('string');
    expect(typeof specs.cookiesEnabled).toBe('boolean');
  });

  it('should detect browser and device specs', () => {
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    const platformGetterDeprecated = jest.spyOn(window.navigator, 'platform', 'get');
    const appVersionGetter = jest.spyOn(window.navigator, 'appVersion', 'get');
    const appNameGetter = jest.spyOn(window.navigator, 'appName', 'get');

    userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    platformGetterDeprecated.mockReturnValue('MacIntel');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.currentBrowser).toEqual('Chrome');
    expect(specs.browserVersion).toEqual('92.0.4515.159');
    expect(specs.browserMajorVersion).toEqual('5');
    expect(specs.isMobile).toBeFalsy();
    expect(specs.os).toEqual('Mac OS X');
    expect(specs.platform).toEqual('macOS');
    expect(specs.currentOSVersion).toEqual('10.15.7');
    expect(specs.cookiesEnabled).toBeTruthy();
    expect(specs.browserLanguage).toEqual('en-US');

    userAgentGetter.mockReturnValue('Mozilla/5.0 iPad OS 10 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.currentBrowser).toEqual('Safari');
    expect(specs.browserVersion).toEqual('14.1');
    expect(specs.browserMajorVersion).toEqual('5');
    expect(specs.isMobile).toBeTruthy();
    expect(specs.os).toEqual('IOS');
    expect(specs.platform).toEqual('macOS');
    expect(specs.currentOSVersion).toEqual('14.1');
    expect(specs.cookiesEnabled).toBeTruthy();
    expect(specs.browserLanguage).toEqual('en-US');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Android 10.5.2 Firefox/92.0.4515.159');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.os).toEqual('Android');
    expect(specs.currentOSVersion).toEqual('10.5.2');
    expect(specs.currentBrowser).toEqual('Firefox');
    expect(specs.browserVersion).toEqual('92.0.4515.159');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Opera 92 OPR 92');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.os).toEqual('Windows 10');
    expect(specs.currentOSVersion).toEqual('10');
    expect(specs.currentBrowser).toEqual('Opera');
    expect(specs.browserVersion).toEqual('92');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Edg 4');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.os).toEqual('Windows 10');
    expect(specs.currentOSVersion).toEqual('10');
    expect(specs.currentBrowser).toEqual('Microsoft Edge');
    expect(specs.browserVersion).toEqual('4');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 8.0 MSIE 11)');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.os).toEqual('Windows 8');
    expect(specs.currentOSVersion).toEqual('8');
    expect(specs.currentBrowser).toEqual('Microsoft Internet Explorer');
    expect(specs.browserVersion).toEqual('11');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 8.0 Trident/rv:11.0;');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.os).toEqual('Windows 8');
    expect(specs.currentOSVersion).toEqual('8');
    expect(specs.currentBrowser).toEqual('Microsoft Internet Explorer');
    expect(specs.browserVersion).toEqual('11.0');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Opera Version 92');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.currentBrowser).toEqual('Opera');
    expect(specs.browserVersion).toEqual('92');

    userAgentGetter.mockReturnValue('Safari/92');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.currentBrowser).toEqual('Safari');
    expect(specs.browserVersion).toEqual('92');

    appNameGetter.mockReturnValue('Microsoft Internet Explorer');

    specs = IdsDeviceEnvUtils.getSpecs();

    expect(specs.browserLanguage).toBe(undefined);
    expect(platformGetterDeprecated).toBeCalledTimes(0);
  });
});
