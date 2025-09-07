(function(global){
  function computePageUrl(page, baseUrl){
    const pageParam = page || 'home';
    const base = baseUrl || (global.location ? (global.location.origin + global.location.pathname) : '');
    return base + `?page=${pageParam}`;
  }

  function buildGoogleChartQrUrl(text, size){
    const s = size || 128;
    const encoded = encodeURIComponent(text || '');
    return `https://chart.googleapis.com/chart?cht=qr&chs=${s}x${s}&chl=${encoded}`;
  }

  // expose
  global.computePageUrl = computePageUrl;
  global.buildGoogleChartQrUrl = buildGoogleChartQrUrl;
  if (typeof module !== 'undefined' && module.exports){
    module.exports = { computePageUrl, buildGoogleChartQrUrl };
  }
})(typeof window !== 'undefined' ? window : globalThis);


