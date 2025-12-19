// core/platform.js
export function getPlatformFlags() {
  const ua = navigator.userAgent;
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isSamsung: /Samsung/i.test(ua),
    isPixel: /Pixel/i.test(ua),
  };
}
