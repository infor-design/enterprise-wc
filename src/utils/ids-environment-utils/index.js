import packageJson from '../../../package.json';

/**
 * @class {IdsEnvironmentUtil}
 */
const IdsEnvironmentUtil = {
  browser: {},

  features: {
    resizeObserver: typeof ResizeObserver !== 'undefined',
    touch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
  },

  os: {},
  devicespecs: {},
  /**
   * Builds run-time environment settings
   */
  set() {
    this.addDeviceSpecs();
  },

  addDeviceSpecs() {
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

    if ((verOffset = nUAgent.indexOf('Opera')) !== -1) { //eslint-disable-line
      browser = 'Opera';
      appVersion = nUAgent.substring(verOffset + 6);
      if ((verOffset = nUAgent.indexOf('Version')) !== -1) { //eslint-disable-line
        appVersion = nUAgent.substring(verOffset + 8);
      }
    }
    if ((verOffset = nUAgent.indexOf('OPR')) !== -1) { //eslint-disable-line
      browser = 'Opera';
      appVersion = nUAgent.substring(verOffset + 4);
    } else if ((verOffset = nUAgent.indexOf('Edg')) !== -1) { //eslint-disable-line
      browser = 'Microsoft Edge';
      appVersion = nUAgent.substring(verOffset + 4);
    } else if ((verOffset = nUAgent.indexOf('MSIE')) !== -1) { //eslint-disable-line
      browser = 'Microsoft Internet Explorer';
      appVersion = nUAgent.substring(verOffset + 5);
    } else if ((verOffset = nUAgent.indexOf('Chrome')) !== -1) { //eslint-disable-line
      browser = 'Chrome';
      appVersion = nUAgent.substring(verOffset + 7);
      if (nUAgent.indexOf('Edg') > -1) {
        browserVersionName = 'Microsoft Edge';
      }
    } else if ((verOffset = nUAgent.indexOf('Safari')) !== -1) { //eslint-disable-line
      browser = 'Safari';
      appVersion = nUAgent.substring(verOffset + 7);
      if ((verOffset = nUAgent.indexOf('Version')) !== -1) { //eslint-disable-line
        appVersion = nUAgent.substring(verOffset + 8);
      }
    } else if (this.browser.isWKWebView()) { //eslint-disable-line
      browser = `WKWebView`; //eslint-disable-line
      appVersion = '';
      majorVersion = '';
    } else if ((verOffset = nUAgent.indexOf('Firefox')) !== -1) { //eslint-disable-line
      browser = 'Firefox';
      appVersion = nUAgent.substring(verOffset + 8);
    } else if (nUAgent.indexOf('Trident/') !== -1) { //eslint-disable-line
      browser = 'Microsoft Internet Explorer';
      appVersion = nUAgent.substring(nUAgent.indexOf('rv:') + 3);
    } else if ((nameOffset = nUAgent.lastIndexOf(' ') + 1) < (verOffset = nUAgent.lastIndexOf('/'))) { //eslint-disable-line
      browser = nUAgent.substring(nameOffset, verOffset);
      appVersion = nUAgent.substring(verOffset + 1);
      if (browser.toLowerCase() === browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    // Trim the version string
    if ((ix = appVersion.indexOf(';')) !== -1) appVersion = appVersion.substring(0, ix); //eslint-disable-line
    if ((ix = appVersion.indexOf(' ')) !== -1) appVersion = appVersion.substring(0, ix); //eslint-disable-line
    if ((ix = appVersion.indexOf(')')) !== -1) appVersion = appVersion.substring(0, ix); //eslint-disable-line

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
      { s: 'UNIX', r: /UNIX/ }
    ];

    for (const id in clientStrings) { //eslint-disable-line
      const cs = clientStrings[id];
      if (cs.r.test(nUAgent)) {
        os = cs.s;
        break;
      }
    }

    let osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
    }

    switch (os) { //eslint-disable-line
    case 'Mac OS X':
      osVersion = /Mac OS X ([1-9][0-9][\.\_\d]+)/.exec(nUAgent)[1].replace(/\_/g, '.'); //eslint-disable-line
      break;

    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(nUAgent)[1]; //eslint-disable-line
      break;

    case 'iOS':
      osVersion = /OS (\d+)_?(\d+)?/.exec(nUAgent); //eslint-disable-line
      osVersion = `${osVersion[1]}.${osVersion[2]}.${(osVersion[3] | 0)}`; //eslint-disable-line
      break;
    }

    if (IdsEnvironmentUtil.browser.isIPad()) {
      const osVersionStr = nUAgent.substr(nUAgent.indexOf('Version'), nUAgent.substr(nUAgent.indexOf('Version')).indexOf(' '));
      osVersion = osVersionStr.replace('Version/', '');
      os = 'IOS';
    }

    this.devicespecs = {
      currentBrowser: browser,
      browserVersion: appVersion.trim(),
      browserMajorVersion: majorVersion,
      isMobile: mobile || IdsEnvironmentUtil.browser.isIPad(),
      os,
      currentOSVersion: osVersion,
      browserVersionName
    };
  },
};

/**
 * @returns {boolean} whether or not the current browser is MS Edge
 */
IdsEnvironmentUtil.browser.isEdge = function () {
  return IdsEnvironmentUtil.browser.name === 'edge';
};

/**
 * @returns {boolean} whether or not the current browser is IE11
 */
IdsEnvironmentUtil.browser.isIE11 = function () {
  return IdsEnvironmentUtil.browser.name === 'ie' && IdsEnvironmentUtil.browser.version === '11';
};

/**
 * @returns {boolean} whether or not the current browser is Safari and includes wkWebView as safari
 */
IdsEnvironmentUtil.browser.isSafari = function () {
  return IdsEnvironmentUtil.browser.name === 'safari' || IdsEnvironmentUtil.browser.name === 'wkwebview';
};

/**
 * @returns {boolean} whether or not the current browser is IE10
 */
IdsEnvironmentUtil.browser.isIE10 = function () {
  return IdsEnvironmentUtil.browser.name === 'ie' && IdsEnvironmentUtil.browser.version === '10';
};

IdsEnvironmentUtil.browser.isIPad = function () {
  return !!(navigator.userAgent.match(/(iPad)/) ||
    (navigator.platform === 'MacIntel' && typeof navigator.standalone !== 'undefined'));
};

export default IdsEnvironmentUtil;
