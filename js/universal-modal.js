/**
 * Universal Modal System
 * 
 * A comprehensive modal implementation that provides:
 * - Consistent behavior across all modals
 * - Full accessibility support (ARIA, focus management)
 * - Mobile back button support
 * - Multiple size variants
 * - Standardized closing methods
 * - Event cleanup and scroll locking
 */

class UniversalModal {
  constructor(options = {}) {
    this.options = {
      size: 'medium', // small, medium, large, fullscreen
      closable: true,
      mobileBackButton: false,
      focusTrap: true,
      scrollLock: true,
      animation: true,
      ...options
    };

    this.modal = document.getElementById('universal-modal');
    this.title = document.getElementById('modal-title');
    this.content = document.getElementById('modal-content');
    this.actions = document.getElementById('modal-actions');
    this.container = this.modal.querySelector('.modal-container');
    
    this.previousFocus = null;
    this.scrollbarWidth = 0;
    this.isOpen = false;
    this.historyState = null;
    
    this.setupEventListeners();
  }

  /**
   * Setup all event listeners for modal behavior
   */
  setupEventListeners() {
    // Escape key handler
    this.escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };

    // Backspace key handler (legacy support)
    this.backspaceHandler = (e) => {
      if (e.key === 'Backspace' && this.isOpen) {
        e.preventDefault();
        this.close();
      }
    };

    // Overlay click handler
    this.overlayHandler = (e) => {
      if (e.target.hasAttribute('data-modal-close') && this.isOpen) {
        this.close();
      }
    };

    // Mobile back button handler
    this.popstateHandler = () => {
      if (this.isOpen && this.options.mobileBackButton) {
        this.close();
      }
    };

    // Focus trap handler
    this.focusTrapHandler = (e) => {
      if (!this.isOpen || !this.options.focusTrap) return;

      const focusableElements = this.getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Attach event listeners
    document.addEventListener('keydown', this.escapeHandler);
    document.addEventListener('keydown', this.backspaceHandler);
    document.addEventListener('keydown', this.focusTrapHandler);
    this.modal.addEventListener('click', this.overlayHandler);
  }

  /**
   * Open the modal with content
   * @param {string} content - HTML content for modal body
   * @param {string} title - Modal title
   * @param {string} actions - HTML content for modal footer
   */
  open(content = '', title = '', actions = '') {
    if (this.isOpen) return;

    this.setContent(content, title, actions);
    this.show();
    
    if (this.options.focusTrap) {
      this.trapFocus();
    }
    
    if (this.options.mobileBackButton) {
      this.setupMobileBackButton();
    }
    
    if (this.options.scrollLock) {
      this.lockScroll();
    }

    this.isOpen = true;
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isOpen) return;

    this.hide();
    
    if (this.options.focusTrap) {
      this.restoreFocus();
    }
    
    if (this.options.mobileBackButton) {
      this.cleanupMobileBackButton();
    }
    
    if (this.options.scrollLock) {
      this.unlockScroll();
    }

    this.isOpen = false;
  }

  /**
   * Set modal content
   * @param {string} content - HTML content for modal body
   * @param {string} title - Modal title
   * @param {string} actions - HTML content for modal footer
   */
  setContent(content = '', title = '', actions = '') {
    this.title.textContent = title;
    this.content.innerHTML = content;
    this.actions.innerHTML = actions;
    
    // Update ARIA attributes
    this.modal.setAttribute('aria-labelledby', title ? 'modal-title' : '');
    this.modal.setAttribute('aria-hidden', 'false');
  }

  /**
   * Show the modal with animation
   */
  show() {
    // Apply size variant
    this.modal.className = this.modal.className.replace(/modal-\w+/g, '');
    this.modal.classList.add(`modal-${this.options.size}`);
    
    // Show modal
    this.modal.classList.remove('opacity-0', 'pointer-events-none');
    this.modal.classList.add('opacity-100', 'pointer-events-auto');
    
    // Animate container
    if (this.options.animation) {
      this.container.classList.remove('scale-95');
      this.container.classList.add('scale-100');
    }
  }

  /**
   * Hide the modal with animation
   */
  hide() {
    // Animate container
    if (this.options.animation) {
      this.container.classList.remove('scale-100');
      this.container.classList.add('scale-95');
    }
    
    // Hide modal
    this.modal.classList.remove('opacity-100', 'pointer-events-auto');
    this.modal.classList.add('opacity-0', 'pointer-events-none');
    
    // Reset ARIA attributes
    this.modal.setAttribute('aria-hidden', 'true');
  }

  /**
   * Trap focus within the modal
   */
  trapFocus() {
    this.previousFocus = document.activeElement;
    
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Restore focus to previously focused element
   */
  restoreFocus() {
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
  }

  /**
   * Get all focusable elements within the modal
   * @returns {Array} Array of focusable elements
   */
  getFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(this.modal.querySelectorAll(focusableSelectors));
  }

  /**
   * Lock body scroll
   */
  lockScroll() {
    // Calculate scrollbar width to prevent layout shift
    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
  }

  /**
   * Unlock body scroll
   */
  unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  /**
   * Setup mobile back button support
   */
  setupMobileBackButton() {
    this.historyState = { modalOpen: true, modalId: this.options.id || 'universal-modal' };
    history.pushState(this.historyState, '');
    window.addEventListener('popstate', this.popstateHandler);
  }

  /**
   * Cleanup mobile back button support
   */
  cleanupMobileBackButton() {
    window.removeEventListener('popstate', this.popstateHandler);
    
    if (history.state && history.state.modalOpen) {
      history.back();
    }
  }

  /**
   * Update modal options
   * @param {Object} newOptions - New options to merge
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Check if modal is currently open
   * @returns {boolean} True if modal is open
   */
  isModalOpen() {
    return this.isOpen;
  }

  /**
   * Cleanup all event listeners
   */
  destroy() {
    document.removeEventListener('keydown', this.escapeHandler);
    document.removeEventListener('keydown', this.backspaceHandler);
    document.removeEventListener('keydown', this.focusTrapHandler);
    this.modal.removeEventListener('click', this.overlayHandler);
    
    if (this.options.mobileBackButton) {
      this.cleanupMobileBackButton();
    }
    
    if (this.isOpen) {
      this.close();
    }
  }
}

/**
 * Convenience functions for common modal use cases
 */

// Global modal instance
let globalModal = null;

/**
 * Initialize the global modal instance
 * @param {Object} options - Modal options
 */
function initModal(options = {}) {
  globalModal = new UniversalModal(options);
  return globalModal;
}

/**
 * Open a simple modal with content
 * @param {string} content - HTML content
 * @param {string} title - Modal title
 * @param {string} actions - Footer actions
 * @param {Object} options - Modal options
 */
function openModal(content, title = '', actions = '', options = {}) {
  if (!globalModal) {
    globalModal = new UniversalModal(options);
  }
  
  globalModal.updateOptions(options);
  globalModal.open(content, title, actions);
}

/**
 * Close the current modal
 */
function closeModal() {
  if (globalModal) {
    globalModal.close();
  }
}

/**
 * Open a resource modal (migrated from old system)
 * @param {Object} resource - Resource object
 */
function openResourceModal(resource) {
  const buttonText = getButtonText ? getButtonText(resource.name) : 'Visit Site';
  const catLabel = getCategoryLabel ? getCategoryLabel(resource.cat) : resource.cat;
  
  const content = resource.detailedSummary ? `
    <div class="text-slate-400 leading-relaxed">
      <ul class="list-disc list-inside space-y-1">
        ${formatDetailedSummary ? formatDetailedSummary(resource.detailedSummary) : resource.detailedSummary}
      </ul>
    </div>
  ` : '';
  
  const actions = `
    <a href="${resource.url}" 
       class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors" 
       onclick="closeModal(); return true;">
      <span>${buttonText}</span>
      ${getLinkIcon ? getLinkIcon(resource.url) : ''}
    </a>
  `;
  
  openModal(content, resource.name, actions, { size: 'medium' });
}

/**
 * Open an image modal (migrated from old system)
 * @param {string} src - Image source
 * @param {string} alt - Image alt text
 * @param {boolean} isCanvas - Whether it's a canvas-generated image
 */
function openImageModal(src, alt, isCanvas = false) {
  const imageClass = isCanvas 
    ? 'w-[min(85vw,85vh)] h-[min(85vw,85vh)] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]'
    : 'max-w-[96vw] max-h-[96vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]';
  
  const content = `<img src="${src}" alt="${alt}" class="${imageClass}" />`;
  
  openModal(content, alt, '', { size: 'large' });
}

// Auto-initialize global modal when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initModal();
  });
} else {
  initModal();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UniversalModal, initModal, openModal, closeModal, openResourceModal, openImageModal };
}
