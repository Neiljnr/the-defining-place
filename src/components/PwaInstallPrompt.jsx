import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Sparkles } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('altar_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 1000 * 60 * 60 * 24 * 7) {
      // dismissed within last 7 days
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds of peaceful exploration
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not standalone, show prompt after delay
    if (isIosDevice && !window.navigator.standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('altar_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      <aside className="pwa-install-banner animate-fade-in" aria-label="Install Sanctuary App">
        <div className="pwa-banner-inner">
          <div className="pwa-icon-monogram">
            <span>TA</span>
          </div>
          <div className="pwa-text-content">
            <div className="pwa-title-row">
              <span className="pwa-title font-serif">The Defining Place App</span>
              <span className="pwa-pill">Offline Ready</span>
            </div>
            <p className="pwa-subtitle">
              Install our digital sanctuary on your phone or tablet for offline reading and uninterrupted ambient prayer.
            </p>
          </div>
          <div className="pwa-actions-row">
            <button className="btn btn-gold btn-sm" onClick={handleInstallClick}>
              <Download size={14} />
              <span>Install App</span>
            </button>
            <button className="pwa-close-btn" onClick={handleDismiss} title="Dismiss">
              <X size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowIosGuide(false)}>
          <div className="ios-guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ios-guide-header">
              <Smartphone size={24} className="text-gold" />
              <h3>Install on iPhone or iPad</h3>
              <button className="modal-close-btn" onClick={() => setShowIosGuide(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="ios-steps-list">
              <div className="ios-step-item">
                <div className="step-num">1</div>
                <div className="step-desc">
                  Tap the <strong>Share</strong> button at the bottom of your Safari screen <Share size={16} className="inline-icon text-teal" />.
                </div>
              </div>
              <div className="ios-step-item">
                <div className="step-num">2</div>
                <div className="step-desc">
                  Scroll down the menu and tap <strong>Add to Home Screen</strong> <PlusSquare size={16} className="inline-icon text-gold" />.
                </div>
              </div>
              <div className="ios-step-item">
                <div className="step-num">3</div>
                <div className="step-desc">
                  Tap <strong>Add</strong> in the top right corner. The ALTAR app will be placed directly on your home screen!
                </div>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-4" onClick={() => setShowIosGuide(false)}>
              <span>Understood</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
