interface DeviceSpecs {
  browser: string,
  os: string,
  cookiesEnabled: boolean,
  locale: string
}

interface EnvSpecs {
  currentBrowser: string,
  browserVersion: string,
  browserMajorVersion: string,
  isMobile: boolean,
  os: string,
  currentOSVersion: string,
  browserVersionName: string,
  idsVersion: string
}

export function getDeviceSpecs(): DeviceSpecs;
export function getEnvSpecs(): EnvSpecs;
