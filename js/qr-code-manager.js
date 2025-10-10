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

    this.url = window.location.href; // This already includes the hash fragment
    this.ECL_LEVELS = ['L', 'M', 'Q', 'H'];
    this.eclIndex = 1; // default 'M'

    // Centralized breakpoint detection using standardized values
    this.getBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      return {
        isMobile: width <= 480,
        isTablet: width > 480 && width <= 768,
        isDesktop: width > 768 && width <= 1024,
        isLargeDesktop: width > 1024,
        isConstrained: (width <= 1024 && height <= 650) || width <= 768,
        isQrModalMobile: width <= 480,
        isQrModalConstrained: (width <= 1024 && height <= 650) || width <= 768
      };
    };

    this.setupEventListeners();
    this.render(this.url);
    
    // RouterEvents abstraction for future-proofing (supports both hash and history routing)
    this.setupRouterEvents();
  }

  /**
   * RouterEvents abstraction for future-proofing
   * Supports both hash-based and history-based routing
   */
  setupRouterEvents() {
    const updateQR = () => {
      this.url = window.location.href;
      this.input.value = this.url;
      this.render(this.url);
    };

    // Listen for hash changes (current hash-based routing)
    window.addEventListener('hashchange', updateQR);
    
    // Listen for popstate (History API - future-proofing for history-based routing)
    window.addEventListener('popstate', updateQR);
    
    // Optional: Listen for pushState/replaceState (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      updateQR();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      updateQR();
    };
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
      this.input.addEventListener('input', () => this.render(this.input.value));
    }

    // ECL controls
    if (this.eclInc) {
      this.eclInc.onclick = () => {
        if (this.eclIndex < this.ECL_LEVELS.length - 1) {
          this.eclIndex++;
          this.updateEclDisplay();
          this.render(this.input ? this.input.value : this.url);
        }
      };
    }

    if (this.eclDec) {
      this.eclDec.onclick = () => {
        if (this.eclIndex > 0) {
          this.eclIndex--;
          this.updateEclDisplay();
          this.render(this.input ? this.input.value : this.url);
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

  resizeInputToContent(input) {
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      font-size: 0.875rem;
      font-family: inherit;
      padding: 0.5rem;
    `;
    tempSpan.textContent = input.value || input.placeholder || 'M';
    
    document.body.appendChild(tempSpan);
    
    // Get the measured width
    const textWidth = tempSpan.getBoundingClientRect().width;
    document.body.removeChild(tempSpan);
    
    // Calculate the desired width (text width + padding)
    const padding = 32; // 0.5rem * 2 + border
    const desiredWidth = Math.max(textWidth + padding, 300); // Minimum 300px
    const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
    
    // Set the width, constrained by min and max
    const finalWidth = Math.min(Math.max(desiredWidth, 300), maxWidth);
    input.style.width = `${finalWidth}px`;
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
              this.svgContainer.className = 'transition-opacity duration-200 ease-in-out hover:opacity-80';
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
        this.originalPanelParent = this.panel.parentElement;
      }
      
      // Move panel to body level to escape stacking context issues
      document.body.appendChild(this.panel);
      
      // Make panel full screen with glow effect
      this.panel.className = 'qr-fullscreen';
      this.panel.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 9999 !important; background: rgba(15, 23, 42, 1.0) !important; backdrop-filter: blur(8px) !important; display: flex !important; align-items: stretch !important; justify-content: center !important; padding: 0 1rem 0 1rem !important;';
      
      // Add the fullscreen CSS styles dynamically if not already added
      if (!document.getElementById('qr-fullscreen-styles')) {
        const style = document.createElement('style');
        style.id = 'qr-fullscreen-styles';
        style.textContent = `
          .qr-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: 9999 !important;
            display: flex !important;
            align-items: stretch !important;
            justify-content: center !important;
            background: rgba(15, 23, 42, 1.0) !important;
            backdrop-filter: blur(8px) !important;
          }
        `;
        document.head.appendChild(style);
      }
      
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
        this.glowContainer.className = 'bg-amber-50 rounded-2xl shadow-2xl border-2 border-amber-200 glow-container-mobile';
        
        // Apply responsive padding based on viewport size (using standardized breakpoints)
        const isConstrained = (window.innerWidth <= 1024 && window.innerHeight <= 650) || window.innerWidth <= 767;
        const padding = isConstrained ? '0.25rem' : '2rem'; // Ultra-minimal padding for constrained viewports
        
        this.glowContainer.style.cssText = `
          background: transparent;
          border: none;
          width: auto;
          max-width: min(90vw, 500px);
          height: 100dvh;
          overflow: visible;
          display: flex;
          flex-direction: column;
          color: #B8B8B8;
          gap: 0.5rem;
          align-items: center;
          justify-content: space-between;
          align-self: stretch;
          padding: ${padding};
          box-sizing: border-box;
        `;
        
        // Add responsive CSS for mobile viewports
        if (!document.getElementById('qr-mobile-responsive')) {
          const mobileStyle = document.createElement('style');
          mobileStyle.id = 'qr-mobile-responsive';
          mobileStyle.textContent = `
            @media (max-width: 480px) {
              .qr-fullscreen .glow-container-mobile {
                width: 100vw !important;
                height: 100dvh !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                max-width: none !important;
                max-height: none !important;
                gap: 0.5rem !important;
              }
              .qr-fullscreen .glow-container-mobile > div:first-child {
                flex: 1 !important;
                min-height: 0 !important;
              }
              .qr-fullscreen .glow-container-mobile > div:first-child > div {
                width: 100vw !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
              }
            }
            @media (min-width: 481px) {
              .qr-fullscreen .glow-container-mobile {
                width: auto !important;
                max-width: min(500px, 90vw) !important;
                height: auto !important;
                max-height: 100dvh !important;
              }
            }
          `;
          document.head.appendChild(mobileStyle);
        }
        
        // Add mobile class for CSS targeting (already added in className above)
        
        // Store original panel content before moving it
        this.originalPanelContent = Array.from(this.panel.children);
        
        // Helper function to create green shadow container
        const createGreenShadowContainer = (content, compact = false) => {
          const container = document.createElement('div');
          container.style.cssText = `
            background: linear-gradient(135deg, #1C1C1C 0%, #3A3A3A 100%);
            border-radius: 1rem;
            padding: ${compact ? '0.25rem' : '0.5rem'};
            box-shadow: 
              0 0 0 1px rgba(4, 112, 60, 0.3),
              0 0 20px rgba(4, 112, 60, 0.4),
              0 0 40px rgba(4, 112, 60, 0.3),
              0 0 80px rgba(4, 112, 60, 0.2),
              0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(4, 112, 60, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          `;
          if (content) {
            container.appendChild(content);
          }
          return container;
        };
        
        // Create QR code container with green shadow
        const qrDisplayArea = document.createElement('div');
        qrDisplayArea.setAttribute('data-qr-panel', 'display');
        qrDisplayArea.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 400px;
          padding: 0.125rem;
        `;
        
        // Create URL container (minimal padding, very compact)
        const urlContainer = document.createElement('div');
        urlContainer.setAttribute('data-qr-panel', 'input');
        urlContainer.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          align-items: center;
          width: 100%;
          height: auto;
          padding: 0.125rem 0.25rem 0 0.25rem;
          background: linear-gradient(135deg, #1C1C1C 0%, #3A3A3A 100%);
          border-radius: 1rem;
          box-shadow: 
            0 0 0 1px rgba(4, 112, 60, 0.3),
            0 0 20px rgba(4, 112, 60, 0.4),
            0 0 40px rgba(4, 112, 60, 0.3),
            0 0 80px rgba(4, 112, 60, 0.2),
            0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(4, 112, 60, 0.5);
          position: relative;
          width: 100%;
        `;
        
        // Create controls container with green shadow  
        const controlsArea = document.createElement('div');
        controlsArea.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          flex-shrink: 0;
          padding: 0.25rem 0;
        `;
        
        // Create a new layout from scratch
        // Add input field with responsive length info
        if (currentInput) {
          // Input is now handled in the controls box - skip this section
        }
        
        // Length info will be moved to QR version box
        
        // Create QR code container
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
        
        // Add QR container directly without green shadow
        qrDisplayArea.appendChild(qrContainer);
        
        // Generate QR code directly in the container (after it's added to DOM)
        setTimeout(() => {
          this.renderQRInContainer(currentText);
        }, 100);
        
        // Create single common box for all controls (no background - will get green shadow)
        const controlsBox = document.createElement('div');
        controlsBox.style.cssText = `
          padding: 0.75rem;
          color: #B8B8B8;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        `;
        
        // Add responsive styles for grid layout
        controlsBox.innerHTML = `
          <style>
            .qr-controls-box {
              display: grid !important;
              grid-template-columns: 1fr auto !important;
              grid-template-rows: auto auto !important;
              gap: 0.5rem 1rem !important;
              align-items: center !important;
              justify-items: start !important;
            }
            .qr-controls-left {
              grid-column: 1 !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            .qr-controls-right {
              grid-column: 2 !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
              align-items: center !important;
            }
          </style>
        `;
        controlsBox.className = 'qr-controls-box';
        
        // Create a common container for both boxes to ensure same width
        const commonContainer = document.createElement('div');
        commonContainer.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          width: fit-content;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        `;
        
        // Create URL/Length box with vertical layout
        if (currentInput) {
          const urlLengthBox = document.createElement('div');
          urlLengthBox.style.cssText = `
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 1rem;
            color: #B8B8B8;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
            width: 100%;
          `;
          
          // Style the input to span the full width of the box
          currentInput.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #4B5563;
            background: #374151;
            color: #B8B8B8;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            transition: width 0.2s ease;
          `;
          
          // Add length info with center justification
          if (this.lengthEl) {
            const lengthInfo = document.createElement('div');
            lengthInfo.className = 'qr-length-info';
            lengthInfo.style.cssText = `
              color: #B8B8B8; 
              font-size: 0.875rem; 
              white-space: nowrap;
              text-align: center;
            `;
            lengthInfo.textContent = `Length: ${this.lengthEl.textContent}`;
            
            // Update display when length changes
            const updateLength = () => {
              lengthInfo.textContent = `Length: ${this.lengthEl.textContent}`;
            };
            
            const lengthObserver = new MutationObserver(updateLength);
            lengthObserver.observe(this.lengthEl, { childList: true, subtree: true, characterData: true });
            
            // Store length info to add after input
            urlLengthBox.lengthInfo = lengthInfo;
          }
          
          urlLengthBox.appendChild(currentInput);
          
          // Add length info after input (so it appears below)
          if (urlLengthBox.lengthInfo) {
            urlLengthBox.appendChild(urlLengthBox.lengthInfo);
          }
          urlLengthBox.className = 'qr-url-length-box';
          urlContainer.appendChild(urlLengthBox);
          
          // Ensure input event listener is attached
          if (!currentInput.hasAttribute('data-fullscreen-listener-attached')) {
            currentInput.addEventListener('input', () => {
              const currentText = currentInput.value;
              this.render(currentText);
              this.renderQRInContainer(currentText);
              
              // Dynamically resize input based on content
              this.resizeInputToContent(currentInput);
            });
            currentInput.setAttribute('data-fullscreen-listener-attached', 'true');
            
            // Initial resize
            this.resizeInputToContent(currentInput);
          }
        }
        
        // Create left column container for QR Version and Error Correction Level
        const leftColumn = document.createElement('div');
        leftColumn.className = 'qr-controls-left';
        leftColumn.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        `;
        
        // Create QR version section
        if (this.info) {
          const versionSection = document.createElement('div');
          versionSection.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
          `;
          
          const versionTitle = document.createElement('div');
          versionTitle.textContent = 'QR Version:';
          versionTitle.style.cssText = 'font-size: 0.75rem; color: #9CA3AF;';
          
          const versionSpan = document.createElement('div');
          versionSpan.textContent = this.info.textContent;
          versionSpan.style.cssText = 'font-weight: bold; font-size: 0.875rem;';
          
          versionSection.appendChild(versionTitle);
          versionSection.appendChild(versionSpan);
          
          // Update display when version changes
          const updateVersion = () => {
            versionSpan.textContent = this.info.textContent;
          };
          
          // Listen for changes to the original element
          const versionObserver = new MutationObserver(updateVersion);
          versionObserver.observe(this.info, { childList: true, subtree: true, characterData: true });
          
          leftColumn.appendChild(versionSection);
        }
        
        // Create error correction section
        if (this.eclDec && this.eclInc && this.eclText) {
          const eclSection = document.createElement('div');
          eclSection.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          `;
          
          const eclTitle = document.createElement('div');
          eclTitle.textContent = 'Error Correction Level';
          eclTitle.style.cssText = 'font-size: 0.75rem; color: #9CA3AF;';
          
          const eclControls = document.createElement('div');
          eclControls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
          `;
          
          // Create new buttons with event handlers
          const decBtn = document.createElement('button');
          decBtn.textContent = '-';
          decBtn.style.cssText = 'padding: 0.25rem 0.5rem; border: 1px solid #4B5563; background: #4B5563; color: #B8B8B8; border-radius: 0.25rem; cursor: pointer;';
          decBtn.addEventListener('click', () => {
            if (this.eclIndex > 0) {
              this.eclIndex--;
              this.updateEclDisplay();
              const currentText = this.input ? this.input.value : this.url;
              this.render(currentText);
              this.renderQRInContainer(currentText);
            }
          });
          
          const incBtn = document.createElement('button');
          incBtn.textContent = '+';
          incBtn.style.cssText = 'padding: 0.25rem 0.5rem; border: 1px solid #4B5563; background: #4B5563; color: #B8B8B8; border-radius: 0.25rem; cursor: pointer;';
          incBtn.addEventListener('click', () => {
            if (this.eclIndex < this.ECL_LEVELS.length - 1) {
              this.eclIndex++;
              this.updateEclDisplay();
              const currentText = this.input ? this.input.value : this.url;
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
          
          eclControls.appendChild(decBtn);
          eclControls.appendChild(displaySpan);
          eclControls.appendChild(incBtn);
          
          eclSection.appendChild(eclTitle);
          eclSection.appendChild(eclControls);
          
          leftColumn.appendChild(eclSection);
        }
        
        // Create right column container for Download section
        const rightColumn = document.createElement('div');
        rightColumn.className = 'qr-controls-right';
        rightColumn.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        `;
        
        // Create download section
        if (this.download) {
          const downloadSection = document.createElement('div');
          downloadSection.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          `;
          
          const downloadTitle = document.createElement('div');
          downloadTitle.textContent = 'DOWNLOAD:';
          downloadTitle.style.cssText = 'font-size: 0.75rem; color: #9CA3AF;';
          
          const downloadButtons = document.createElement('div');
          downloadButtons.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
          `;
          
          // PNG Button
          const pngBtn = document.createElement('button');
          pngBtn.textContent = 'PNG';
          pngBtn.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #4B5563;
            background: #4B5563;
            color: #B8B8B8;
            border-radius: 0.25rem;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
          `;
          pngBtn.addEventListener('click', () => {
            this.downloadQR('png');
          });
          pngBtn.addEventListener('mouseenter', () => {
            pngBtn.style.background = '#6B7280';
            pngBtn.style.borderColor = '#6B7280';
          });
          pngBtn.addEventListener('mouseleave', () => {
            pngBtn.style.background = '#4B5563';
            pngBtn.style.borderColor = '#4B5563';
          });
          
          // SVG Button
          const svgBtn = document.createElement('button');
          svgBtn.textContent = 'SVG';
          svgBtn.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #4B5563;
            background: #4B5563;
            color: #B8B8B8;
            border-radius: 0.25rem;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
          `;
          svgBtn.addEventListener('click', () => {
            this.downloadQR('svg');
          });
          svgBtn.addEventListener('mouseenter', () => {
            svgBtn.style.background = '#6B7280';
            svgBtn.style.borderColor = '#6B7280';
          });
          svgBtn.addEventListener('mouseleave', () => {
            svgBtn.style.background = '#4B5563';
            svgBtn.style.borderColor = '#4B5563';
          });
          
          downloadButtons.appendChild(pngBtn);
          downloadButtons.appendChild(svgBtn);
          
          downloadSection.appendChild(downloadTitle);
          downloadSection.appendChild(downloadButtons);
          rightColumn.appendChild(downloadSection);
        }
        
        // Add both columns to the main controls box
        controlsBox.appendChild(leftColumn);
        controlsBox.appendChild(rightColumn);
        
        // Add controls box to common container
        commonContainer.appendChild(controlsBox);
        
        // Add common container to controls area
        controlsArea.appendChild(commonContainer);
        
        // Create green shadow container only for controls (URL container doesn't need it)
        const controlsGreenContainer = createGreenShadowContainer(controlsArea, true);
        
        // Add semantic attribute to the green shadow container (the one that actually gets hidden)
        controlsGreenContainer.setAttribute('data-qr-panel', 'advanced');
        
        // Assemble the layout: QR code at top, URL pushed to bottom with margin-top: auto
        this.glowContainer.appendChild(qrDisplayArea);
        this.glowContainer.appendChild(urlContainer); // URL container pushed to bottom
        this.glowContainer.appendChild(controlsGreenContainer);
        
        // Add the glow container to the panel
        this.panel.appendChild(this.glowContainer);
        
        // Apply responsive behavior and accessibility
        this.applyResponsiveBehavior();
        
        // Listen for viewport changes to update panel visibility
        if (!this.resizeListener) {
          this.resizeListener = () => {
            this.applyResponsiveBehavior();
          };
          window.addEventListener('resize', this.resizeListener);
        }
        
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
      
      // Add back button handler for mobile devices
      this.backButtonHandler = () => {
        this.closeFullScreen();
      };
      window.addEventListener('popstate', this.backButtonHandler);
      
      // Push a state to the history so back button works
      history.pushState({ qrModalOpen: true }, '', window.location.href);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // No auto-focus to prevent keyboard popup on mobile and keep behavior consistent
      
        // Re-render the QR code with full-screen size
        const renderText = this.input ? this.input.value : this.url;
        this.render(renderText);
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
        
        // Calculate maximum QR code size - always use viewport-based maximum size
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Reserve space for URL and controls (estimate ~60px total with minimal padding)
        const reservedSpace = 60;
        const maxAvailableSize = Math.min(viewportWidth, viewportHeight - reservedSpace);
        
        // Constrain QR size to fit within the 400px display area (accounting for padding)
        const maxDisplaySize = 400 - 4; // 400px height - 4px padding (2px top + 2px bottom)
        const qrSize = Math.min(Math.max(300, maxAvailableSize - 10), maxDisplaySize);
        
        // Generate new QR code
        QRCode.toString(text, {
          type: 'svg',
          width: qrSize,
          margin: 0,
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
      
      // Move panel back to original parent
      if (this.originalPanelParent) {
        this.originalPanelParent.appendChild(this.panel);
      }
      
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
      
      // Remove back button handler
      if (this.backButtonHandler) {
        window.removeEventListener('popstate', this.backButtonHandler);
        this.backButtonHandler = null;
      }
      
      // Pop the history state we added
      if (history.state && history.state.qrModalOpen) {
        history.back();
      }
      
      // Restore body scroll
      document.body.style.overflow = 'auto';
      
      // Hide the panel after restoring
      this.panel.classList.add('hidden');
      
      // Re-render the QR code with normal size
      const currentText = this.input ? this.input.value : this.url;
      this.render(currentText);
    }
  }

  downloadQR(format = 'png') {
    const text = (this.input && this.input.value) || this.url;
    
    // Generate filename based on current page URL or custom URL
    const generateFilename = (fileFormat) => {
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
          return `qr-home.${fileFormat}`;
        }
        
        // Remove leading slash and replace remaining slashes with hyphens
        pathname = pathname.replace(/^\//, '').replace(/\//g, '-');
        
        // Remove any trailing slashes and clean up
        pathname = pathname.replace(/\/$/, '').replace(/-$/, '');
        
        // If pathname is empty after cleaning, use 'home'
        if (!pathname) {
          return `qr-home.${fileFormat}`;
        }
        
        return `qr-${pathname}.${fileFormat}`;
      } else {
        // Use custom URL - return generic filename
        return `qr-custom.${fileFormat}`;
      }
    };
    
    const filename = generateFilename(format);
    
    if (format === 'svg') {
      // Generate SVG QR code
      try {
        QRCode.toString(text, { 
          type: 'svg', 
          width: 512, 
          margin: 1, 
          errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex] 
        }, (err, svgString) => {
          if (err) throw err;
          
          // Create blob and download
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        });
      } catch (err) {
        console.error('SVG generation failed:', err);
        // Fallback to PNG
        this.downloadQR('png');
      }
    } else {
      // Generate PNG QR code (default)
      const tmpCanvas = document.createElement('canvas');
      
      try {
        QRCode.toCanvas(tmpCanvas, text, { 
          width: 512, 
          margin: 1, 
          errorCorrectionLevel: this.ECL_LEVELS[this.eclIndex] 
        }, () => {
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

  applyResponsiveBehavior() {
    // Check if viewport is constrained (using standardized breakpoints)
    const isConstrained = (window.innerWidth <= 1024 && window.innerHeight <= 650) || window.innerWidth <= 767;
    const advancedContainer = this.panel.querySelector('[data-qr-panel="advanced"]');
    
    if (advancedContainer) {
      if (isConstrained) {
        // CSS handles visibility - we only manage accessibility state
        advancedContainer.setAttribute('aria-hidden', 'true');
        advancedContainer.setAttribute('tabindex', '-1');
        
        // Make all interactive elements inert (in case they're still accessible somehow)
        const interactiveElements = advancedContainer.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        interactiveElements.forEach(el => {
          // Store original tabindex
          if (!el.dataset._originalTabIndex) {
            el.dataset._originalTabIndex = el.getAttribute('tabindex') || '';
          }
          el.setAttribute('tabindex', '-1');
          
          // Set inert if available
          if ('inert' in el) {
            el.inert = true;
          }
        });
      } else {
        // CSS handles visibility - we only manage accessibility state
        advancedContainer.removeAttribute('aria-hidden');
        advancedContainer.removeAttribute('tabindex');
        
        // Restore tabindex and remove inert
        const interactiveElements = advancedContainer.querySelectorAll('button, input, select, textarea, [tabindex="-1"]');
        interactiveElements.forEach(el => {
          const originalTabIndex = el.dataset._originalTabIndex;
          if (originalTabIndex !== undefined) {
            if (originalTabIndex === '') {
              el.removeAttribute('tabindex');
            } else {
              el.setAttribute('tabindex', originalTabIndex);
            }
            delete el.dataset._originalTabIndex;
          }
          
          // Remove inert if available
          if ('inert' in el) {
            el.inert = false;
          }
        });
      }
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
