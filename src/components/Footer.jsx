import React from 'react';
import { Heart, ShieldCheck, Mail, MapPin, ArrowUpRight, Copy, Check } from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function Footer({ setActivePage, openGivingModal, openAccountModal }) {
  const [copiedBank, setCopiedBank] = React.useState(false);

  const copyNairaAccount = () => {
    navigator.clipboard.writeText("0123456789");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <footer className="sanctuary-footer">
      <div className="container footer-main-content">
        <div className="footer-grid">
          {/* Column 1: Brand & Pastoral Vision */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="logo-monogram">
                <span>TA</span>
              </div>
              <div>
                <h3 className="footer-title">THE ALTAR</h3>
                <p className="footer-subtitle">The Defining Place for Rest International Ministries</p>
              </div>
            </div>

            <p className="footer-description">
              A ministry of Rev. Tresh — books, messages, giving, and quiet counsel for a global family of faith.
              Bridging ancient biblical truth and everyday modern life, from Lagos, Nigeria to seekers worldwide.
            </p>

            <div className="footer-give-action">
              <button 
                className="btn btn-primary"
                onClick={() => openGivingModal()}
              >
                <Heart size={15} />
                <span>Give / Support The Ministry</span>
              </button>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Explore</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => setActivePage('books')}>Books & Devotionals</button>
              </li>
              <li>
                <button onClick={() => setActivePage('audio')}>Audio Messages</button>
              </li>
              <li>
                <button onClick={() => setActivePage('videos')}>Video Gatherings</button>
              </li>
              <li>
                <button onClick={() => setActivePage('give')}>Sow a Seed (Giving)</button>
              </li>
              <li>
                <button onClick={() => setActivePage('prayer')}>Share a Need (Prayer)</button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')}>About Rev. Tresh</button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')}>Contact & Gathering Location</button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Fine Print & Sanctuary */}
          <div className="footer-col">
            <h4 className="footer-col-heading">The Fine Print</h4>
            <ul className="footer-links">
              <li>
                <button onClick={openAccountModal}>My Account Portal</button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')}>Confidentiality Pledge</button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')}>Statement of Faith</button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="pastor-portal-link">
                  <ShieldCheck size={13} className="inline-icon mr-1 text-gold" />
                  <span>Pastor’s Study (Admin)</span>
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Notice: All prayer requests and donor details are encrypted at rest and never shared with third parties."); }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: The Defining Place is a non-profit international ministry registered in Nigeria and globally."); }}>
                  Terms of Service
                </a>
              </li>
            </ul>

            <div className="ministry-presence">
              <div className="presence-item">
                <MapPin size={15} className="text-gold" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="presence-item">
                <Mail size={15} className="text-teal" />
                <span>counsel@thedefiningplace.org</span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Giving / Bank Transfer */}
          <div className="footer-col bank-col">
            <div className="footer-bank-card">
              <span className="bank-card-tag">Direct Bank Transfer</span>
              <p className="bank-card-title">Support from Nigeria</p>
              
              <div className="bank-meta-row">
                <span className="bank-label">Bank:</span>
                <span className="bank-val">Access Bank Plc</span>
              </div>
              <div className="bank-meta-row">
                <span className="bank-label">Account:</span>
                <span className="bank-val mono">0123456789</span>
              </div>
              <div className="bank-meta-row">
                <span className="bank-label">Name:</span>
                <span className="bank-val">The Defining Place Ministry</span>
              </div>

              <button 
                className="btn btn-outline btn-sm copy-bank-btn"
                onClick={copyNairaAccount}
              >
                {copiedBank ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
                <span>{copiedBank ? "Copied Account!" : "Copy Account Details"}</span>
              </button>

              <p className="bank-intl-hint">
                International USD & GBP transfers available on the <button className="inline-link" onClick={() => setActivePage('give')}>Giving page</button>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 THE ALTAR · The Defining Place for Rest International Ministries. All rights reserved.
          </p>
          <div className="footer-badge">
            <ShieldCheck size={14} className="text-gold" />
            <span>Sacred Stillness · Pastoral Care · Truth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
