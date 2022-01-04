/**
 * @jest-environment jsdom
 */
import { getSpecs } from '../../src/utils/ids-device-env-specs-utils/ids-device-env-specs-utils';

describe('IdsDeviceEnvUtils Tests', () => {
  let specs;

  beforeEach(async () => {
    specs = getSpecs();
  });

  afterEach(async () => {
    specs = null;
  });

  it('should initialize without an errors', () => {
    expect(specs).toBeDefined();
  });

  it('should type check', () => {
    expect(typeof specs.browser).toBe('string');
    expect(typeof specs.browserVersion).toBe('string');
    expect(typeof specs.isMobile).toBe('boolean');
    expect(typeof specs.platform).toBe('string');
    expect(typeof specs.browserLanguage).toBe('string');
    expect(typeof specs.idsVersion).toBe('string');
  });

  it('should check isMobile with matchMedia present', () => {
    expect(specs.isMobile).toBeFalsy();

    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query
      }))
    });
    specs = getSpecs();
    expect(specs.isMobile).toBeFalsy();
  });

  it('should detect browser and device specs', () => {
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    const platformGetter = jest.spyOn(window.navigator, 'platform', 'get');
    const appVersionGetter = jest.spyOn(window.navigator, 'appVersion', 'get');
    const appNameGetter = jest.spyOn(window.navigator, 'appName', 'get');

    userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    platformGetter.mockReturnValue('MacIntel');

    specs = getSpecs();

    expect(specs.browser).toEqual('Chrome');
    expect(specs.browserVersion).toEqual('92.0.4515.159');
    expect(specs.isMobile).toBeFalsy();
    expect(specs.platform).toEqual('MacIntel');
    expect(specs.browserLanguage).toEqual('en-US');

    userAgentGetter.mockReturnValue('Mozilla/5.0 iPad OS 10 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');
    platformGetter.mockReturnValue('MacIntel');

    specs = getSpecs();

    expect(specs.browser).toEqual('Safari');
    expect(specs.browserVersion).toEqual('14.1');
    expect(specs.platform).toEqual('MacIntel');
    expect(specs.browserLanguage).toEqual('en-US');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Android 10.5.2 Firefox/92.0.4515.159');

    specs = getSpecs();

    expect(specs.browser).toEqual('Firefox');
    expect(specs.browserVersion).toEqual('92.0.4515.159');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Opera 92 OPR 92');

    specs = getSpecs();

    expect(specs.browser).toEqual('Opera');
    expect(specs.browserVersion).toEqual('92');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Edg 4');

    specs = getSpecs();

    expect(specs.browser).toEqual('Microsoft Edge');
    expect(specs.browserVersion).toEqual('4');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 8.0 MSIE 11)');

    specs = getSpecs();

    expect(specs.browser).toEqual('Microsoft Internet Explorer');
    expect(specs.browserVersion).toEqual('11');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 8.0 Trident/rv:11.0;');

    specs = getSpecs();

    expect(specs.browser).toEqual('Microsoft Internet Explorer');
    expect(specs.browserVersion).toEqual('11.0');

    userAgentGetter.mockReturnValue('Mozilla/5.0 Windows 10.0 Opera Version 92');

    specs = getSpecs();

    expect(specs.browser).toEqual('Opera');
    expect(specs.browserVersion).toEqual('92');

    userAgentGetter.mockReturnValue('Safari/92');

    specs = getSpecs();

    expect(specs.browser).toEqual('Safari');
    expect(specs.browserVersion).toEqual('92');

    appNameGetter.mockReturnValue('Microsoft Internet Explorer');

    specs = getSpecs();

    expect(specs.browserLanguage).toBe('en-US');
  });
});
