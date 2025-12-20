// core/platform.js
// 100% null-safe, bez side-effectova
alert("PLATFORM.JS LOADED");

export function getPlatformFlags() {
  let ua = "";

  try {
    ua = navigator.userAgent || "";
  } catch (e) {
    ua = "";
  }

  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const isSamsung = /Samsung/i.test(ua);
  const isPixel = /Pixel/i.test(ua);

  return {
    isIOS,
    isAndroid,
    isSamsung,
    isPixel
  };
}
