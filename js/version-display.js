/**
 * Modern Version Display - 2025 Best Practice
 * Dynamically fetches version from version.json (single source of truth)
 * No more hardcoded versions or update-index-version.js complexity
 */

class VersionDisplay {
  constructor() {
    this.versionUrl = '/version.json';
    this.cacheBuster = `?t=${Date.now()}`;
    this.init();
  }

  async init() {
    try {
      await this.updateVersion();
    } catch (error) {
      console.warn('Failed to load version info:', error);
      this.showFallback();
    }
  }

  async updateVersion() {
    const response = await fetch(`${this.versionUrl}${this.cacheBuster}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const versionInfo = await response.json();
    this.displayVersion(versionInfo);
  }

  displayVersion(versionInfo) {
    // Update footer version display
    const versionSpan = document.getElementById('version');
    if (versionSpan) {
      versionSpan.textContent = `v${versionInfo.version}`;
    }

    // Update meta tag for SEO
    const versionMeta = document.getElementById('version-meta');
    if (versionMeta) {
      versionMeta.setAttribute('content', versionInfo.version);
    }

    // Update tooltip with full info
    const versionTooltip = document.getElementById('version-tooltip');
    if (versionTooltip) {
      versionTooltip.textContent = `v${versionInfo.version} - Commit: ${versionInfo.commit} - ${versionInfo.date}`;
    }

    // Update any other version displays
    const versionElements = document.querySelectorAll('[data-version]');
    versionElements.forEach(el => {
      el.textContent = versionInfo.version;
    });

    console.log(`✅ Version display updated to v${versionInfo.version}`);
  }

  showFallback() {
    // Fallback to package.json version if available
    const versionSpan = document.getElementById('version');
    if (versionSpan) {
      versionSpan.textContent = 'v1.7.6'; // Fallback version
    }
    console.warn('Using fallback version display');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VersionDisplay());
} else {
  new VersionDisplay();
}

// Make it globally available for debugging
window.VersionDisplay = VersionDisplay;
