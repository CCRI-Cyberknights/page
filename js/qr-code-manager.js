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
        
        // Generate SVG QR code
        const qrSize = this.panel && this.panel.classList.contains('qr-fullscreen') ? 512 : 160;
        QRCode.toString(text, {
          type: 'svg',
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex]
        }, (err, svgString) => {
          if (err) {
            this.fallbackImg(text);
          } else {
            // Replace canvas with SVG container if it doesn't exist
            if (!this.svgContainer) {
              this.svgContainer = document.createElement('div');
              this.svgContainer.style.width = qrSize + 'px';
              this.svgContainer.style.height = qrSize + 'px';
              this.svgContainer.style.display = 'flex';
              this.svgContainer.style.alignItems = 'center';
              this.svgContainer.style.justifyContent = 'center';
              this.svgContainer.style.cursor = 'pointer';
              this.svgContainer.style.margin = '0 auto';
              this.svgContainer.title = 'Click to open QR Code Manager in full screen';
              this.svgContainer.className = 'transition-transform duration-200 ease-in-out hover:scale-105';
              this.canvas.parentNode.insertBefore(this.svgContainer, this.canvas);
              this.canvas.style.display = 'none';
            } else {
              // Update size for full-screen mode
              this.svgContainer.style.width = qrSize + 'px';
              this.svgContainer.style.height = qrSize + 'px';
              this.svgContainer.style.margin = '0 auto';
            }
            
            // Always ensure click handler is attached (in case it was removed or never added)
            if (this.svgContainer && !this.svgContainer.hasAttribute('data-click-handler-attached')) {
              this.svgContainer.addEventListener('click', () => {
                this.expandPanel();
              });
              this.svgContainer.setAttribute('data-click-handler-attached', 'true');
            }
            
            this.svgContainer.innerHTML = svgString;
            if (this.info) this.info.textContent = versionDesc || '';
            if (this.lengthEl) this.lengthEl.textContent = text.length;
          }
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
    // Hide SVG container and show canvas for fallback
    if (this.svgContainer) {
      this.svgContainer.style.display = 'none';
    }
    this.canvas.style.display = 'block';
    
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.info) this.info.textContent = `Encoder error`;
    if (this.lengthEl) this.lengthEl.textContent = text.length;
  }

  expandPanel() {
    // Expand the QR Code Manager panel to full screen
    if (this.panel) {
      // Store original classes and styles
      if (!this.originalPanelClasses) {
        this.originalPanelClasses = this.panel.className;
        this.originalPanelStyle = this.panel.style.cssText;
      }
      
      // Make panel full screen with glow effect
      this.panel.className = 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center qr-fullscreen';
      this.panel.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;';
      
      // Create a glowing container for the QR Code Manager content
      // Always recreate to ensure proper styling
      if (this.glowContainer) {
        this.glowContainer.remove();
        this.glowContainer = null;
      }
      
      // Get current input value and create new elements for fullscreen layout
      const currentInput = this.input;
      const currentText = currentInput ? currentInput.value : this.url;
      
        // Clear the panel content first
        while (this.panel.firstChild) {
          this.panel.removeChild(this.panel.firstChild);
        }
        
        // Also clear any existing length info elements that might be floating around
        const existingLengthInfo = document.querySelectorAll('[style*="Length:"]');
        existingLengthInfo.forEach(el => {
          if (el.textContent.includes('Length:')) {
            el.remove();
          }
        });
      
      if (!this.glowContainer) {
        this.glowContainer = document.createElement('div');
        this.glowContainer.className = 'bg-amber-50 rounded-2xl p-8 shadow-2xl border-2 border-amber-200';
        this.glowContainer.style.cssText = `
          background: linear-gradient(135deg, #1C1C1C 0%, #3A3A3A 100%);
          border-radius: 1rem;
          padding: 0.5rem;
          box-shadow: 
            0 0 0 1px rgba(4, 112, 60, 0.3),
            0 0 20px rgba(4, 112, 60, 0.4),
            0 0 40px rgba(4, 112, 60, 0.3),
            0 0 80px rgba(4, 112, 60, 0.2),
            0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(4, 112, 60, 0.5);
          width: 90vw;
          height: 90vh;
          overflow: auto;
          display: flex;
          flex-direction: column;
          color: #B8B8B8;
          gap: 0.25rem;
        `;
        
        // Store original panel content before moving it
        this.originalPanelContent = Array.from(this.panel.children);
        
        // Create a new layout structure for full-screen mode
        const qrDisplayArea = document.createElement('div');
        qrDisplayArea.style.cssText = `
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.25rem;
          min-height: 0;
        `;
        
        const controlsArea = document.createElement('div');
        controlsArea.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: center;
          flex-shrink: 0;
        `;
        
        // Create a new layout from scratch
        // Add input field with responsive length info
        if (currentInput) {
          const inputWrapper = document.createElement('div');
          inputWrapper.style.cssText = `
            width: 100%; 
            margin-bottom: 0.125rem; 
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
          `;
          
          // Create input row
          const inputRow = document.createElement('div');
          inputRow.className = 'qr-input-row';
          inputRow.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';
          inputRow.appendChild(currentInput);
          
          // Add length info that will be responsive
          if (this.lengthEl) {
            const lengthInfo = document.createElement('div');
            lengthInfo.className = 'qr-length-info';
            lengthInfo.style.cssText = `
              color: #B8B8B8; 
              font-size: 0.875rem; 
              margin-left: 0.5rem;
              white-space: nowrap;
            `;
            lengthInfo.textContent = `Length: ${this.lengthEl.textContent}`;
            
            // Update display when length changes
            const updateLength = () => {
              lengthInfo.textContent = `Length: ${this.lengthEl.textContent}`;
            };
            
            // Listen for changes to the original element
            const lengthObserver = new MutationObserver(updateLength);
            lengthObserver.observe(this.lengthEl, { childList: true, subtree: true, characterData: true });
            
            inputRow.appendChild(lengthInfo);
          }
          
          inputWrapper.appendChild(inputRow);
          this.glowContainer.appendChild(inputWrapper);
          
          // Ensure input event listener is attached
          if (!currentInput.hasAttribute('data-fullscreen-listener-attached')) {
            currentInput.addEventListener('input', () => {
              const currentText = currentInput.value || this.url;
              this.render(currentText);
              this.renderQRInContainer(currentText);
            });
            currentInput.setAttribute('data-fullscreen-listener-attached', 'true');
          }
        }
        
        // Length info will be moved to QR version box
        
        // Create QR code display area with white box
        const qrDisplayWrapper = document.createElement('div');
        qrDisplayWrapper.style.cssText = `
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          flex: 1;
          min-height: 0;
        `;
        
        // Create QR code container (no white box)
        const qrContainer = document.createElement('div');
        qrContainer.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          aspect-ratio: 1;
          margin: 0 auto;
        `;
        
        qrDisplayWrapper.appendChild(qrContainer);
        qrDisplayArea.appendChild(qrDisplayWrapper);
        
        // Generate QR code directly in the container (after it's added to DOM)
        setTimeout(() => {
          this.renderQRInContainer(currentText);
        }, 100);
        
        // Create responsive controls area with boxes
        const controlsWrapper = document.createElement('div');
        controlsWrapper.style.cssText = `
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          justify-content: center;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        `;
        
          // Add responsive styles
          controlsWrapper.innerHTML = `
            <style>
              @media (max-width: 768px) {
                .qr-controls-responsive {
                  flex-direction: column !important;
                  gap: 0.75rem !important;
                }
              }
              
              @media (max-width: 600px) {
                .qr-input-row {
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  gap: 0.25rem !important;
                }
                .qr-length-info {
                  margin-left: 0 !important;
                }
              }
            </style>
          `;
        controlsWrapper.className = 'qr-controls-responsive';
        
        // Create QR version box with two-line format
        if (this.info) {
          const versionBox = document.createElement('div');
          versionBox.style.cssText = `
            background: rgba(55, 65, 81, 0.8);
            border: 1px solid #374151;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            color: #B8B8B8;
            font-size: 0.875rem;
            text-align: center;
            min-width: 120px;
          `;
          
          const versionTitle = document.createElement('div');
          versionTitle.textContent = 'QR Version:';
          versionTitle.style.cssText = 'font-size: 0.75rem; color: #9CA3AF; margin-bottom: 0.25rem;';
          versionBox.appendChild(versionTitle);
          
          const versionSpan = document.createElement('div');
          versionSpan.textContent = this.info.textContent;
          versionSpan.style.cssText = 'font-weight: bold;';
          versionBox.appendChild(versionSpan);
          
          // Update display when version changes
          const updateVersion = () => {
            versionSpan.textContent = this.info.textContent;
          };
          
          // Listen for changes to the original element
          const versionObserver = new MutationObserver(updateVersion);
          versionObserver.observe(this.info, { childList: true, subtree: true, characterData: true });
          
          controlsWrapper.appendChild(versionBox);
        }
        
        // Create error correction box
        if (this.eclDec && this.eclInc && this.eclText) {
          const eclBox = document.createElement('div');
          eclBox.style.cssText = `
            background: rgba(55, 65, 81, 0.8);
            border: 1px solid #374151;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            color: #B8B8B8;
            font-size: 0.875rem;
            text-align: center;
            min-width: 160px;
          `;
          
          const eclTitle = document.createElement('div');
          eclTitle.textContent = 'Error Correction Level';
          eclTitle.style.cssText = 'margin-bottom: 0.5rem; font-size: 0.75rem; color: #9CA3AF;';
          
          // Create new buttons with event handlers
          const decBtn = document.createElement('button');
          decBtn.textContent = '-';
          decBtn.style.cssText = 'padding: 0.25rem 0.5rem; border: 1px solid #4B5563; background: #4B5563; color: #B8B8B8; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem;';
          decBtn.addEventListener('click', () => {
            if (this.eclIndex > 0) {
              this.eclIndex--;
              this.updateEclDisplay();
              const currentText = (this.input && this.input.value) || this.url;
              this.render(currentText);
              this.renderQRInContainer(currentText);
            }
          });
          
          const incBtn = document.createElement('button');
          incBtn.textContent = '+';
          incBtn.style.cssText = 'padding: 0.25rem 0.5rem; border: 1px solid #4B5563; background: #4B5563; color: #B8B8B8; border-radius: 0.25rem; cursor: pointer; margin-left: 0.5rem;';
          incBtn.addEventListener('click', () => {
            if (this.eclIndex < this.ECL_LEVELS.length - 1) {
              this.eclIndex++;
              this.updateEclDisplay();
              const currentText = (this.input && this.input.value) || this.url;
              this.render(currentText);
              this.renderQRInContainer(currentText);
            }
          });
          
          const displaySpan = document.createElement('span');
          displaySpan.textContent = this.eclText.textContent;
          displaySpan.style.cssText = 'color: #B8B8B8; min-width: 1.5ch; text-align: center; font-weight: bold;';
          
          // Update display when error correction level changes
          const updateDisplay = () => {
            displaySpan.textContent = this.eclText.textContent;
          };
          
          // Listen for changes to the original display element
          const observer = new MutationObserver(updateDisplay);
          observer.observe(this.eclText, { childList: true, subtree: true, characterData: true });
          
          eclBox.appendChild(eclTitle);
          eclBox.appendChild(decBtn);
          eclBox.appendChild(displaySpan);
          eclBox.appendChild(incBtn);
          
          controlsWrapper.appendChild(eclBox);
        }
        
        // Create download box
        if (this.download) {
          const downloadBox = document.createElement('div');
          downloadBox.style.cssText = `
            background: rgba(55, 65, 81, 0.8);
            border: 1px solid #374151;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            color: #B8B8B8;
            font-size: 0.875rem;
            text-align: center;
            min-width: 120px;
          `;
          
          const downloadClone = this.download.cloneNode(true);
          downloadClone.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #4B5563; background: #4B5563; color: #B8B8B8; border-radius: 0.25rem; cursor: pointer; width: 100%;';
          // Add direct download functionality
          downloadClone.addEventListener('click', () => {
            this.downloadQR();
          });
          
          downloadBox.appendChild(downloadClone);
          controlsWrapper.appendChild(downloadBox);
        }
        
        controlsArea.appendChild(controlsWrapper);
        
        // Assemble the layout in correct order
        this.glowContainer.appendChild(qrDisplayArea);
        this.glowContainer.appendChild(controlsArea);
        
        // Add the glow container to the panel
        this.panel.appendChild(this.glowContainer);
        
        // Force update wrapper styles after DOM manipulation
        setTimeout(() => {
          const qrWrapper = this.glowContainer.querySelector('.flex.justify-center');
          const whiteBox = this.glowContainer.querySelector('.bg-white');
          
          if (qrWrapper) {
            qrWrapper.style.cssText = `
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              width: 100% !important;
              height: 100% !important;
              flex: 1 !important;
            `;
            console.log('QR wrapper styles updated:', qrWrapper.style.cssText);
          }
          
          if (whiteBox) {
            whiteBox.style.cssText = `
              background: white !important;
              padding: 1rem !important;
              border-radius: 0.5rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: 512px !important;
              height: 512px !important;
              margin: 0 auto !important;
            `;
            console.log('White box styles updated:', whiteBox.style.cssText);
          }
        }, 100);
      }
      
      // Add close button if it doesn't exist
      if (!this.closeButton) {
        this.closeButton = document.createElement('button');
        this.closeButton.innerHTML = '✕';
        this.closeButton.className = 'absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 flex items-center justify-center text-lg font-bold';
        this.closeButton.title = 'Close full-screen QR Manager (or press Escape)';
        this.closeButton.addEventListener('click', () => this.closeFullScreen());
        this.panel.appendChild(this.closeButton);
      }
      
      // Add escape key handler
      this.escapeHandler = (e) => {
        if (e.key === 'Escape') {
          this.closeFullScreen();
        }
      };
      document.addEventListener('keydown', this.escapeHandler);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // No auto-focus to prevent keyboard popup on mobile and keep behavior consistent
      
        // Re-render the QR code with full-screen size
        const renderText = this.input ? this.input.value : this.url;
        if (renderText) {
          this.render(renderText);
        }
    }
  }

  renderQRInContainer(text) {
    if (window.QRCode && this.glowContainer) {
      const qrContainer = this.glowContainer.querySelector('[style*="aspect-ratio: 1"]');
      if (qrContainer) {
        // Clear existing QR code
        const existingQR = qrContainer.querySelector('svg, canvas, div');
        if (existingQR) {
          existingQR.remove();
        }
        
        // Calculate dynamic size based on available space
        const qrDisplayAreaRect = this.glowContainer.querySelector('[style*="flex: 1"]').getBoundingClientRect();
        const availableSize = Math.min(qrDisplayAreaRect.width, qrDisplayAreaRect.height); // Use full available space
        const qrSize = Math.max(100, availableSize - 10); // Minimal margin for QR code margin, lower minimum
        
        // Generate new QR code
        QRCode.toString(text, {
          type: 'svg',
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex]
        }, (err, svgString) => {
          if (err) {
            console.error('QR Code generation failed:', err);
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
              width: 100%;
              height: 100%;
              background: #f0f0f0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #666;
              font-size: 1.2rem;
            `;
            placeholder.textContent = 'QR Code generation failed';
            qrContainer.appendChild(placeholder);
          } else {
            // Create SVG element
            const svgElement = document.createElement('div');
            svgElement.innerHTML = svgString;
            const svg = svgElement.firstChild;
            svg.style.cssText = `
              width: ${qrSize}px;
              height: ${qrSize}px;
              max-width: 100%;
              max-height: 100%;
            `;
            qrContainer.appendChild(svg);
          }
        });
      }
    }
  }

  closeFullScreen() {
    // Restore original panel appearance
    if (this.panel && this.originalPanelClasses) {
      // Move content back from glow container to panel
      if (this.glowContainer) {
        // Move all content back to the panel
        while (this.glowContainer.firstChild) {
          this.panel.appendChild(this.glowContainer.firstChild);
        }
        // Remove the glow container
        this.glowContainer.remove();
        this.glowContainer = null;
      }
      
      // Restore original panel styling
      this.panel.className = this.originalPanelClasses;
      this.panel.style.cssText = this.originalPanelStyle;
      
      // Remove fullscreen class
      this.panel.classList.remove('qr-fullscreen');
      
      // Remove close button
      if (this.closeButton) {
        this.closeButton.remove();
        this.closeButton = null;
      }
      
      // Remove escape key handler
      if (this.escapeHandler) {
        document.removeEventListener('keydown', this.escapeHandler);
        this.escapeHandler = null;
      }
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
      
      // Hide the panel after restoring
      this.panel.classList.add('hidden');
      
      // Re-render the QR code with normal size
      const currentText = this.input ? this.input.value : this.url;
      if (currentText) {
        this.render(currentText);
      }
    }
  }

  expandQRCode() {
    // Expand SVG QR code to full screen modal
    if (this.svgContainer && this.svgContainer.innerHTML) {
      const svgContent = this.svgContainer.innerHTML;
      const dataURL = 'data:image/svg+xml;base64,' + btoa(svgContent);
      
      // Use the global openModal function if available
      if (typeof window.openModal === 'function') {
        window.openModal(dataURL, 'QR Code', true); // true = isCanvas for modal sizing
      } else {
        console.warn('openModal function not available');
      }
    }
  }

  downloadQR() {
    // Always download as PNG for better compatibility
    const tmpCanvas = document.createElement('canvas');
    const text = (this.input && this.input.value) || this.url;
    
    // Generate filename based on current page URL or custom URL
    const generateFilename = () => {
      const currentPageUrl = window.location.href;
      const inputUrl = text;
      
      // Check if the input URL matches the current page URL exactly
      if (inputUrl === currentPageUrl) {
        // Use current page URL for filename
        const url = new URL(currentPageUrl);
        let pathname = url.pathname;
        
        // For SPA, check if we have a hash route
        if (url.hash && url.hash.startsWith('#/')) {
          // Extract route from hash (e.g., #/calendar -> calendar)
          pathname = url.hash.substring(2); // Remove '#/'
        }
        
        // Remove leading slash and convert to filename-friendly format
        if (pathname === '/' || pathname === '' || pathname === 'home') {
          return 'qr-home.png';
        }
        
        // Remove leading slash and replace remaining slashes with hyphens
        pathname = pathname.replace(/^\//, '').replace(/\//g, '-');
        
        // Remove any trailing slashes and clean up
        pathname = pathname.replace(/\/$/, '').replace(/-$/, '');
        
        // If pathname is empty after cleaning, use 'home'
        if (!pathname) {
          return 'qr-home.png';
        }
        
        return `qr-${pathname}.png`;
      } else {
        // Use custom URL - return generic filename
        return 'qr-custom.png';
      }
    };
    
    const filename = generateFilename();
    
    try {
      QRCode.toCanvas(tmpCanvas, text, { width: 512, margin: 1, errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex] }, () => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = tmpCanvas.toDataURL('image/png');
        link.click();
      });
    } catch {
      const ctx = tmpCanvas.getContext('2d');
      tmpCanvas.width = this.canvas.width;
      tmpCanvas.height = this.canvas.height;
      ctx.drawImage(this.canvas, 0, 0);
      const link = document.createElement('a');
      link.download = filename;
      link.href = tmpCanvas.toDataURL('image/png');
      link.click();
    }
  }
}

// Auto-initialize function (only for main site)
function initializeQRCodes() {
  // Only auto-initialize if we're on the main site (not standalone pages)
  if (document.getElementById('footer-qr-toggle') && !window.location.pathname.includes('/resources/')) {
    window.qrCodeManager = new QRCodeManager({
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQRCodes);
} else {
  initializeQRCodes();
}
