/**
 * @jest-environment jsdom
 */
import { IdsDeviceEnvUtils } from '../../src/utils';

describe('IdsDeviceEnvUtils Tests', () => {
  let specs;
  let env;

  beforeEach(async () => {
    specs = IdsDeviceEnvUtils.getDeviceSpecs();
    env = IdsDeviceEnvUtils.getEnvSpecs();
  });

  afterEach(async () => {
    specs = null;
    env = null;
  });

  it('should initialize without an errors', () => {
    expect(specs).toBeDefined();
    expect(env).toBeDefined();
  });

  it('should type check', () => {
    expect(typeof env.currentBrowser).toBe('string');
    expect(typeof env.browserVersion).toBe('string');
    expect(typeof env.browserMajorVersion).toBe('string');
    expect(typeof env.isMobile).toBe('boolean');
    expect(typeof env.os).toBe('string');
    expect(typeof env.currentOSVersion).toBe('string');
    expect(typeof env.browserVersionName).toBe('string');
    expect(typeof env.idsVersion).toBe('string');

    expect(typeof specs.browser).toBe('string');
    expect(typeof specs.os).toBe('string');
    expect(typeof specs.cookiesEnabled).toBe('boolean');
    expect(typeof specs.locale).toBe('string');
  });

  it('should detect browser and device specs', () => {
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    const platformGetter = jest.spyOn(window.navigator, 'platform', 'get');
    const appVersionGetter = jest.spyOn(window.navigator, 'appVersion', 'get');
    userAgentGetter.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
    platformGetter.mockReturnValue('MacIntel');

    env = IdsDeviceEnvUtils.getEnvSpecs();

    expect(env.currentBrowser).toEqual('Chrome');
    expect(env.browserVersion).toEqual('92.0.4515.159');
    expect(env.browserMajorVersion).toEqual('5');
    expect(env.isMobile).toBeFalsy();
    expect(env.os).toEqual('Mac OS X');
    expect(env.currentOSVersion).toEqual('10.15.7');

    userAgentGetter.mockReturnValue('Mozilla/5.0 iPad OS 10 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');
    appVersionGetter.mockReturnValue('5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15');
    platformGetter.mockReturnValue('MacIntel');

    env = IdsDeviceEnvUtils.getEnvSpecs();

    expect(env.currentBrowser).toEqual('Safari');
    expect(env.browserVersion).toEqual('14.1');
    expect(env.browserMajorVersion).toEqual('5');
    expect(env.isMobile).toBeTruthy();
    expect(env.os).toEqual('IOS');
    expect(env.currentOSVersion).toEqual('14.1');
  });
});
