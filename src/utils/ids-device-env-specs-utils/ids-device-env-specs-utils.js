import packageJson from '../../../package.json';

/**
 * @private
 * @returns {object} device specs
 */
export function getDeviceSpecs() {
  const locale = navigator.appName === 'Microsoft Internet Explorer'
    ? navigator.userLanguage
    : navigator.language;
  const browser = () => {
    const ua = navigator.userAgent;
    let result = [];
    let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
    ) || [];

    if (/trident/i.test(M[1])) {
      result = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return `IE '${result[1]}`;
    }

    if (M[1] === 'Chrome') {
      result = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (result != null) {
        return result.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    result = ua.match(/version\/(\d+)/i);
    if (result !== null) {
      M.splice(1, 1, result[1]);
    }

    return M.join(' ');
  };

  return {
    browser: browser(),
    os: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    locale,
  };
}

/**
 * @private
 * @returns {object} env specs
 */
export function getEnvSpecs() {
  const unknown = '-';
  const nAppVer = navigator.appVersion;
  const nUAgent = navigator.userAgent;
  let browser = navigator.appName;
  let appVersion = ` ${parseFloat(navigator.appVersion)}`;
  let majorVersion = parseInt(navigator.appVersion, 10);
  let nameOffset;
  let verOffset;
  let ix;
  let browserVersionName = '';
  const isIPad = () => !!(navigator.userAgent.match(/(iPad)/)
    || (navigator.platform === 'MacIntel' && typeof navigator.standalone !== 'undefined'));

  if (nUAgent.indexOf('Opera') !== -1) {
    verOffset = nUAgent.indexOf('Opera');
    browser = 'Opera';
    appVersion = nUAgent.substring(verOffset + 6);
    if (nUAgent.indexOf('Version') !== -1) {
      verOffset = nUAgent.indexOf('Version');
      appVersion = nUAgent.substring(verOffset + 8);
    }
  }
  if (nUAgent.indexOf('OPR') !== -1) {
    verOffset = nUAgent.indexOf('OPR');
    browser = 'Opera';
    appVersion = nUAgent.substring(verOffset + 4);
  } else if (nUAgent.indexOf('Edg') !== -1) {
    verOffset = nUAgent.indexOf('Edg');
    browser = 'Microsoft Edge';
    appVersion = nUAgent.substring(verOffset + 4);
  } else if (nUAgent.indexOf('MSIE') !== -1) {
    verOffset = nUAgent.indexOf('MSIE');
    browser = 'Microsoft Internet Explorer';
    appVersion = nUAgent.substring(verOffset + 5);
  } else if (nUAgent.indexOf('Chrome') !== -1) {
    verOffset = nUAgent.indexOf('Chrome');
    browser = 'Chrome';
    appVersion = nUAgent.substring(verOffset + 7);
    if (nUAgent.indexOf('Edg') > -1) {
      browserVersionName = 'Microsoft Edge';
    }
  } else if (nUAgent.indexOf('Safari') !== -1) {
    verOffset = nUAgent.indexOf('Safari');
    browser = 'Safari';
    appVersion = nUAgent.substring(verOffset + 7);
    if (nUAgent.indexOf('Version') !== -1) {
      verOffset = nUAgent.indexOf('Version');
      appVersion = nUAgent.substring(verOffset + 8);
    }
  } else if (this.browser.isWKWebView()) {
    browser = `WKWebView`;
    appVersion = '';
    majorVersion = '';
  } else if (nUAgent.indexOf('Firefox') !== -1) {
    verOffset = nUAgent.indexOf('Firefox');
    browser = 'Firefox';
    appVersion = nUAgent.substring(verOffset + 8);
  } else if (nUAgent.indexOf('Trident/') !== -1) {
    browser = 'Microsoft Internet Explorer';
    appVersion = nUAgent.substring(nUAgent.indexOf('rv:') + 3);
  } else if (nUAgent.lastIndexOf(' ') + 1 < nUAgent.lastIndexOf('/')) {
    nameOffset = nUAgent.lastIndexOf(' ');
    verOffset = nUAgent.lastIndexOf('/');
    browser = nUAgent.substring(nameOffset, verOffset);
    appVersion = nUAgent.substring(verOffset + 1);
    if (browser.toLowerCase() === browser.toUpperCase()) {
      browser = navigator.appName;
    }
  }
  // Trim the version string
  if (appVersion.indexOf(';') !== -1) {
    ix = appVersion.indexOf(';');
    appVersion = appVersion.substring(0, ix);
  }
  if (appVersion.indexOf(' ') !== -1) {
    ix = appVersion.indexOf(' ');
    appVersion = appVersion.substring(0, ix);
  }
  if (appVersion.indexOf(')') !== -1) {
    ix = appVersion.indexOf(')');
    appVersion = appVersion.substring(0, ix);
  }

  majorVersion = ` ${parseInt(appVersion, 10)}`;
  if (Number.isNaN(majorVersion)) {
    appVersion = ` ${parseFloat(navigator.appVersion)}`;
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  // mobile version
  const mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nAppVer);

  let os = unknown;

  const clientStrings = [
    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Linux', r: /(Linux|X11)/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'UNIX', r: /UNIX/ },
  ];

  os = (clientStrings.find((cs) => cs.r.test(nUAgent)) || {}).s;

  let osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
  }

  switch (os) {
  case 'Mac OS X':
    osVersion = /Mac OS X ([1-9][0-9][._\d]+)/
      .exec(nUAgent)[1]
      .replace(/_/g, '.');
    break;

  case 'Android':
    osVersion = /Android ([._\d]+)/.exec(nUAgent)[1];
    break;

  case 'iOS':
    osVersion = /OS (\d+)_?(\d+)?/.exec(nUAgent);
    osVersion = `${osVersion[1]}.${osVersion[2]}.${osVersion[3] | 0}`;
    break;

  default:
    osVersion = unknown;
    break;
  }

  if (isIPad()) {
    const osVersionStr = nUAgent.substr(
      nUAgent.indexOf('Version'),
      nUAgent.substr(nUAgent.indexOf('Version')).indexOf(' ')
    );
    osVersion = osVersionStr.replace('Version/', '');
    os = 'IOS';
  }

  return {
    currentBrowser: browser,
    browserVersion: appVersion.trim(),
    browserMajorVersion: majorVersion,
    isMobile: mobile || isIPad(),
    os,
    currentOSVersion: osVersion,
    browserVersionName,
    idsVersion: packageJson.version
  };
}

export const IdsDeviceEnvUtils = {
  getDeviceSpecs,
  getEnvSpecs,
};
export default IdsDeviceEnvUtils;
export { IdsDeviceEnvUtils as deviceEnvUtils };
