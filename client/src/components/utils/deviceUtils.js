export const checkBrowser = () => {
    const userAgent = navigator.userAgent;
  
    // Browser detection based on reliable indicators and version information
    const isChromeDesktop = userAgent.includes('Chrome') && !userAgent.includes('OPR') && !userAgent.includes('Edg') && !userAgent.includes('CriOS') && !userAgent.includes('SamsungBrowser');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    const isEdge = userAgent.includes('Edg');
    const isOpera = userAgent.includes('OPR');
    const isMobileSafari = /iPad|iPhone|iPod/.test(userAgent) && !isChromeDesktop;
    const isAndroidChrome = userAgent.includes('Chrome') && userAgent.includes('Android');
    const isSamsungInternet = userAgent.includes('SamsungBrowser');
    const isAndroidWebView = userAgent.includes('wv') && userAgent.includes('Android');
  
    // Prioritize more specific detections
    if (isChromeDesktop) {
      const chromeVersion = userAgent.match(/Chrome\/(\d+)\./);
      if (chromeVersion) {
        return `Chrome (desktop) v${chromeVersion[1]}`;
      } else {
        return 'Chrome (desktop)'; // Return generic Chrome for older versions
      }
    } else if (isMobileSafari) {
      const safariVersion = userAgent.match(/Version\/(\d+)\.(\d+)/);
      if (safariVersion) {
        return `Mobile Safari v${safariVersion[1]}.${safariVersion[2]}`;
      } else {
        return 'Mobile Safari'; // Return generic Mobile Safari for older versions
      }
    } else if (isFirefox) {
      const firefoxVersion = userAgent.match(/Firefox\/(\d+)\./);
      if (firefoxVersion) {
        return `Firefox v${firefoxVersion[1]}`;
      } else {
        return 'Firefox'; // Return generic Firefox for older versions
      }
    } else if (isEdge) {
      const edgeVersion = userAgent.match(/Edg\/(\d+)\./);
      if (edgeVersion) {
        return `Microsoft Edge v${edgeVersion[1]}`;
      } else {
        return 'Microsoft Edge'; // Return generic Edge for older versions
      }
    } else if (isOpera) {
      const operaVersion = userAgent.match(/OPR\/(\d+)\./);
      if (operaVersion) {
        return `Opera v${operaVersion[1]}`;
      } else {
        return 'Opera'; // Return generic Opera for older versions
      }
    } else if (isAndroidChrome) {
      const chromeAndroidVersion = userAgent.match(/CriOS\/(\d+)\./);
      if (chromeAndroidVersion) {
        return `Chrome (Android) v${chromeAndroidVersion[1]}`;
      } else {
        return 'Chrome (Android)'; // Return generic Chrome (Android) for older versions
      }
    } else if (isSamsungInternet) {
      const samsungVersion = userAgent.match(/SamsungBrowser\/(\d+)\./);
      if (samsungVersion) {
        return `Samsung Internet v${samsungVersion[1]}`;
      } else {
        return 'Samsung Internet'; // Return generic Samsung Internet for older versions
      }
    } else if (isAndroidWebView) {
      return 'Android WebView';
    } else {
      return 'Unknown or unsupported browser';
    }
  };
  