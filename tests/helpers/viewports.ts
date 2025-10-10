// tests/helpers/viewports.ts
// Precise mobile viewport definitions for consistent testing
// Aligned with standardized breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop)

export const viewports = {
  // iPhone devices
  iphone13: { width: 390, height: 844 },
  iphone13Pro: { width: 390, height: 844 },
  iphoneSE: { width: 375, height: 667 },
  
  // Android devices
  pixel7a: { width: 414, height: 794 }, // Your actual Pixel 7a viewport
  pixel7: { width: 412, height: 915 },
  pixel5: { width: 393, height: 851 },
  
  // Small Android devices
  smallAndroid: { width: 360, height: 740 },
  
  // Desktop viewports
  desktop: { width: 1867, height: 963 }, // Your actual desktop viewport
  laptop: { width: 1280, height: 720 },
  smallLaptop: { width: 1024, height: 624 }, // Small laptop / large tablet landscape
  tablet: { width: 768, height: 1024 },
};

export const mobileViewports = {
  pixel7a: viewports.pixel7a,
  pixel5: viewports.pixel5,
  smallAndroid: viewports.smallAndroid,
  iphone13: viewports.iphone13,
};

export const desktopViewports = {
  desktop: viewports.desktop,
  laptop: viewports.laptop,
  smallLaptop: viewports.smallLaptop,
  tablet: viewports.tablet,
};

// Helper function to get viewport by device name
export function getViewport(device: keyof typeof viewports) {
  return viewports[device];
}

// Helper function to check if viewport is mobile (aligned with --breakpoint-tablet: 768px)
export function isMobileViewport(viewport: { width: number; height: number }) {
  return viewport.width < 768;
}

// Helper function to check if viewport is constrained (aligned with standardized logic)
export function isConstrainedViewport(viewport: { width: number; height: number }) {
  return (viewport.width <= 1024 && viewport.height <= 650) || viewport.width <= 768;
}

