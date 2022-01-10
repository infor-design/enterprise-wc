interface Specs {
  currentBrowser: string,
  browserVersion: string,
  browserMajorVersion: string,
  isMobile: boolean,
  os: string,
  currentOSVersion: string,
  idsVersion: string,
  platform: string,
  browserLanguage: string
}

export function getSpecs(): Specs;
