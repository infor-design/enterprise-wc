import { version } from '../../core/ids-attributes';

/**
 * Return an object with some browser information. Used primary for the ids-about component.
 * You avoid using browser detection for anything else.
 * @returns {object} browser device env specs
 */
export function getSpecs() {
  const nUAgent = navigator.userAgent;
  let appVersion = ` ${parseFloat(navigator.appVersion)}`;
  const platform = navigator.userAgentData?.platform || navigator.platform;
  const isMobile = window.matchMedia ? window.matchMedia('only screen and (max-width: 760px)').matches : false;
  let nameOffset;
  let verOffset;
  let browser = '';

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
  } else if (nUAgent.indexOf('Safari') !== -1) {
    verOffset = nUAgent.indexOf('Safari');
    browser = 'Safari';
    appVersion = nUAgent.substring(verOffset + 7);
    if (nUAgent.indexOf('Version') !== -1) {
      verOffset = nUAgent.indexOf('Version');
      appVersion = nUAgent.substring(verOffset + 8);
    }
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
  }

  // Trim the version string
  let ix;
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

  return {
    platform,
    isMobile,
    browser,
    browserVersion: appVersion.trim(),
    idsVersion: version,
    browserLanguage: navigator.language
  };
}
