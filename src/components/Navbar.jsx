import React, { useState } from 'react';
import { 
  Sun, Moon, Search, Heart, Menu, X, BookOpen, Headphones, 
  Video, ShieldCheck, Sparkles, User, Globe, ChevronDown 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  currency, 
  setCurrency, 
  theme, 
  toggleTheme,
  dailyScripture,
  openGivingModal,
  openSearchModal,
  openAccountModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems = [
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'give', label: 'Giving', icon: Heart },
    { id: 'prayer', label: 'Prayer', icon: ShieldCheck },
    { id: 'about', label: 'About', icon: Sparkles }
  ];

  return (
    <header className="navbar-wrapper">
      {/* Utility Top Bar */}
      <div className="top-utility-bar">
        <div className="container top-utility-inner">
          <div className="top-verse-ticker">
            <span className="ticker-badge">Daily Word</span>
            <span className="ticker-text">
              “{dailyScripture?.verse || 'Be still, and know that I am God.'}” — {dailyScripture?.reference || 'Psalm 46:10'}
            </span>
          </div>

          <div className="top-utility-actions">
            {/* Currency Selector */}
            <div className="currency-selector-wrapper">
              <button 
                className="utility-btn currency-toggle"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                aria-label="Select currency"
              >
                <Globe size={13} />
                <span>{currency} ({ministryData.currencies[currency].symbol})</span>
                <ChevronDown size={12} />
              </button>

              {currencyDropdownOpen && (
                <div className="currency-dropdown-menu">
                  {Object.keys(ministryData.currencies).map((currKey) => (
                    <button
                      key={currKey}
                      className={`currency-option ${currKey === currency ? 'active' : ''}`}
                      onClick={() => {
                        setCurrency(currKey);
                        setCurrencyDropdownOpen(false);
                      }}
                    >
                      <span className="curr-sym">{ministryData.currencies[currKey].symbol}</span>
                      <span className="curr-name">{currKey}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              className="utility-btn theme-toggle" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Daylight' : 'Midnight'} Sanctuary`}
            >
              {theme === 'dark' ? <Sun size={14} className="text-gold" /> : <Moon size={14} />}
              <span className="hide-mobile">{theme === 'dark' ? 'Daylight' : 'Midnight'}</span>
            </button>

            {/* Account Link */}
            <button 
              className="utility-btn" 
              onClick={openAccountModal}
              title="My Sanctuary Account"
            >
              <User size={13} />
              <span>My Account</span>
            </button>

            {/* Pastor Admin Study Link */}
            <button 
              className={`utility-btn pastor-study-btn ${activePage === 'admin' ? 'active-admin' : ''}`}
              onClick={() => setActivePage('admin')}
              title="Pastor's Study (Sanctuary Dashboard)"
            >
              <ShieldCheck size={13} className="text-gold" />
              <span>Pastor's Study</span>
            </button>

            <button 
              className="utility-btn hide-mobile" 
              onClick={() => setActivePage('contact')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-navbar">
        <div className="container main-navbar-inner">
          {/* Logo */}
          <button 
            className="brand-logo" 
            onClick={() => setActivePage('home')}
            aria-label="The Defining Place Home"
          >
            <div className="logo-monogram">
              <span>TA</span>
            </div>
            <div className="logo-text">
              <span className="logo-title">THE ALTAR</span>
              <span className="logo-subtitle">THE DEFINING PLACE FOR REST</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="desktop-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Header Actions */}
          <div className="nav-actions">
            <button 
              className="icon-action-btn"
              onClick={openSearchModal}
              title="Search ministry library"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button 
              className="btn btn-primary nav-give-btn"
              onClick={() => openGivingModal()}
            >
              <Heart size={16} className="text-white fill-current" />
              <span>Give</span>
            </button>

            {/* Mobile Hamburger */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-nav-list">
            <button 
              className={`mobile-nav-item ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            >
              Home
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
            <button 
              className={`mobile-nav-item ${activePage === 'contact' ? 'active' : ''}`}
              onClick={() => { setActivePage('contact'); setMobileMenuOpen(false); }}
            >
              Contact Us
            </button>
            <button 
              className="mobile-nav-item"
              onClick={() => { openAccountModal(); setMobileMenuOpen(false); }}
            >
              <User size={18} />
              <span>My Account</span>
            </button>
          </div>

          <div className="mobile-drawer-footer">
            <button 
              className="btn btn-gold w-full"
              onClick={() => { openGivingModal(); setMobileMenuOpen(false); }}
            >
              <Heart size={16} />
              <span>Sow a Seed / Give</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
