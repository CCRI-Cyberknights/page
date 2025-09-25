/**
 * QR Code Manager - Shared functionality for QR Code generation
 * Uses qrcode.min.js library directly
 */

class QRCodeManager {
  constructor(options = {}) {
    this.options = {
      toggleId: 'footer-qr-toggle',
      panelId: 'footer-qr-panel',
      canvasId: 'footer-qr-canvas',
      infoId: 'footer-qr-info',
      inputId: 'footer-qr-input',
      downloadId: 'footer-qr-download',
      eclTextId: 'footer-qr-ecl',
      eclIncId: 'footer-qr-ecl-inc',
      eclDecId: 'footer-qr-ecl-dec',
      lengthId: 'footer-qr-length',
      downloadFilename: 'qr-page.png',
      ...options
    };

    this.toggle = document.getElementById(this.options.toggleId);
    this.panel = document.getElementById(this.options.panelId);
    this.canvas = document.getElementById(this.options.canvasId);
    this.info = document.getElementById(this.options.infoId);
    this.input = document.getElementById(this.options.inputId);
    this.download = document.getElementById(this.options.downloadId);
    this.eclText = document.getElementById(this.options.eclTextId);
    this.eclInc = document.getElementById(this.options.eclIncId);
    this.eclDec = document.getElementById(this.options.eclDecId);
    this.lengthEl = document.getElementById(this.options.lengthId);

    if (!this.toggle || !this.panel || !this.canvas) return;

    this.url = window.location.href;
    this.ECL_LEVELS = ['L', 'M', 'Q', 'H'];
    this.eclIndex = 1; // default 'M'

    this.setupEventListeners();
    this.render(this.url);
  }

  setupEventListeners() {
    // Toggle panel
    this.toggle.addEventListener('click', () => {
      this.panel.classList.toggle('hidden');
      
      // Trigger input flash animation when panel opens
      if (!this.panel.classList.contains('hidden') && this.input) {
        this.input.classList.remove('input-flash');
        // Force reflow to restart animation
        this.input.offsetHeight;
        this.input.classList.add('input-flash');
      }
    });

    // Input changes
    if (this.input) {
      this.input.value = this.url;
      this.input.addEventListener('input', () => this.render(this.input.value || this.url));
    }

    // ECL controls
    if (this.eclInc) {
      this.eclInc.onclick = () => {
        if (this.eclIndex < this.ECL_LEVELS.length - 1) {
          this.eclIndex++;
          this.updateEclDisplay();
          this.render((this.input && this.input.value) || this.url);
        }
      };
    }

    if (this.eclDec) {
      this.eclDec.onclick = () => {
        if (this.eclIndex > 0) {
          this.eclIndex--;
          this.updateEclDisplay();
          this.render((this.input && this.input.value) || this.url);
        }
      };
    }

    // Download functionality
    if (this.download) {
      this.download.addEventListener('click', () => {
        this.downloadQR();
      });
    }
  }

  updateEclDisplay() {
    if (this.eclText) {
      this.eclText.textContent = this.ECL_LEVELS[this.eclIndex];
    }
  }

  render(text) {
    if (window.QRCode) {
      try {
        let versionDesc = '';
        try {
          const model = QRCode.create(text, { errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex] });
          versionDesc = `${model.version} (${model.modules.size}×${model.modules.size})`;
        } catch {}
        QRCode.toCanvas(this.canvas, text, {
          width: 160,
          margin: 1,
          errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex]
        }, (err) => {
          if (err) this.fallbackImg(text);
          if (this.info) this.info.textContent = versionDesc || '';
          if (this.lengthEl) this.lengthEl.textContent = text.length;
        });
      } catch {
        this.fallbackImg(text);
      }
    } else {
      this.fallbackImg(text);
    }
    this.updateEclDisplay();
  }

  fallbackImg(text) {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.info) this.info.textContent = `Encoder error`;
    if (this.lengthEl) this.lengthEl.textContent = text.length;
  }

  downloadQR() {
    const tmpCanvas = document.createElement('canvas');
    const text = (this.input && this.input.value) || this.url;
    try {
      QRCode.toCanvas(tmpCanvas, text, { width: 512, margin: 1, errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex] }, () => {
        const link = document.createElement('a');
        link.download = this.options.downloadFilename;
        link.href = tmpCanvas.toDataURL('image/png');
        link.click();
      });
    } catch {
      const ctx = tmpCanvas.getContext('2d');
      tmpCanvas.width = this.canvas.width;
      tmpCanvas.height = this.canvas.height;
      ctx.drawImage(this.canvas, 0, 0);
      const link = document.createElement('a');
      link.download = this.options.downloadFilename;
      link.href = tmpCanvas.toDataURL('image/png');
      link.click();
    }
  }
}

// Auto-initialize function (only for main site)
function initializeQRCodes() {
  // Only auto-initialize if we're on the main site (not standalone pages)
  if (document.getElementById('footer-qr-toggle') && !window.location.pathname.includes('/resources/')) {
    new QRCodeManager({
      downloadFilename: 'qr-page.png'
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQRCodes);
} else {
  initializeQRCodes();
}
