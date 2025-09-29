/**
 * Modern Version Display - 2025 Best Practice
 * Dynamically fetches version from version.json (single source of truth)
 * Implements modern patterns: cache-busting, error handling, performance optimization
 */

class VersionDisplay {
  constructor() {
    // Detect environment and use correct path
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    this.versionUrl = isLocalhost ? '/version.json' : '/page/version.json';
    this.cacheBuster = `?t=${Date.now()}`;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.init();
  }

  async init() {
    try {
      await this.updateVersion();
    } catch (error) {
      console.warn('Failed to load version info:', error);
      await this.handleRetry(error);
    }
  }

  async updateVersion() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(`${this.versionUrl}${this.cacheBuster}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const versionInfo = await response.json();
      this.validateVersionInfo(versionInfo);
      this.displayVersion(versionInfo);
      this.retryCount = 0; // Reset retry count on success
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  validateVersionInfo(versionInfo) {
    if (!versionInfo.version || typeof versionInfo.version !== 'string') {
      throw new Error('Invalid version format in version.json');
    }
    
    // Validate semantic version format (basic check)
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    if (!semverRegex.test(versionInfo.version)) {
      console.warn(`Non-standard version format: ${versionInfo.version}`);
    }
  }

  async handleRetry(error) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying version fetch (attempt ${this.retryCount}/${this.maxRetries})...`);
      
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * this.retryCount));
      
      try {
        await this.updateVersion();
      } catch (retryError) {
        await this.handleRetry(retryError);
      }
    } else {
      console.error('Max retries exceeded, showing fallback version');
      this.showFallback();
    }
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
    console.error('Version display failed - using fallback');
    
    // Set a clearly wrong version to make failures visible
    const versionSpan = document.getElementById('version');
    if (versionSpan) {
      versionSpan.textContent = 'vERROR';
      versionSpan.style.color = '#ef4444'; // Red color to indicate error
    }
    
    // Set error tooltip
    const versionTooltip = document.getElementById('version-tooltip');
    if (versionTooltip) {
      versionTooltip.textContent = 'Version display failed - check console for details';
    }
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
