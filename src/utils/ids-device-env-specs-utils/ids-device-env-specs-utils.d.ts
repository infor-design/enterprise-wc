interface Specs {
  currentBrowser: string,
  browserVersion: string,
  browserMajorVersion: string,
  isMobile: boolean,
  os: string,
  currentOSVersion: string,
  browserVersionName: string,
  idsVersion: string,
  cookiesEnabled: boolean,
  platform: string,
  browserLanguage: string
}

export function getSpecs(): Specs;
