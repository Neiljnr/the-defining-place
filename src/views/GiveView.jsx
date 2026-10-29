import React, { useState } from 'react';
import { 
  Heart, Copy, Check, ShieldCheck, Sparkles, Building2, 
  CreditCard, ArrowRight, CheckCircle, Globe 
} from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function GiveView({ openGivingModal, currency, setCurrency }) {
  const [giveFrequency, setGiveFrequency] = useState('one-time');
  const [selectedPreset, setSelectedPreset] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [designatedFund, setDesignatedFund] = useState('General Ministry Fund — Where the need is greatest');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const currencyObj = ministryData.currencies[currency];
  const symbol = currencyObj.symbol;

  const presetsByCurrency = {
    NGN: [5000, 10000, 25000, 50000],
    USD: [25, 50, 100, 250],
    GBP: [20, 40, 80, 200],
    EUR: [25, 50, 100, 250]
  };

  const currentPresets = presetsByCurrency[currency] || presetsByCurrency.USD;
  const activeAmount = customAmount ? parseFloat(customAmount) : (selectedPreset || currentPresets[1]);

  const bankInfo = ministryData.bankAccounts[currency] || ministryData.bankAccounts.USD;

  const copyBankInfo = () => {
    navigator.clipboard.writeText(`${bankInfo.bankName}\nAccount Name: ${bankInfo.accountName}\nAccount Number: ${bankInfo.accountNumber}\nSWIFT/BIC: ${bankInfo.swiftBic || ''}`);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleStartGive = (e) => {
    e.preventDefault();
    openGivingModal();
  };

  return (
    <div className="give-view animate-fade-in">
      {/* Header */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">Sow a Seed</span>
          <h1 className="page-title">Every gift becomes a quiet act of ministry.</h1>
          <p className="page-subtitle">
            You choose the currency, the amount, and the fund. We handle the receipt and the work.
          </p>
        </div>
      </section>

      {/* Main 2-Column Section */}
      <section className="section-spacing pt-0">
        <div className="container">
          <div className="give-page-layout">
            {/* Left Column: Interactive Form */}
            <div className="give-form-card">
              <h2 className="give-card-heading">Your Gift</h2>

              {/* Frequency Toggle */}
              <div className="giving-toggle-pill mb-6">
                <button
                  type="button"
                  className={`pill-btn ${giveFrequency === 'one-time' ? 'active' : ''}`}
                  onClick={() => setGiveFrequency('one-time')}
                >
                  One-time
                </button>
                <button
                  type="button"
                  className={`pill-btn ${giveFrequency === 'monthly' ? 'active' : ''}`}
                  onClick={() => setGiveFrequency('monthly')}
                >
                  Monthly
                </button>
              </div>

              {/* Currency Selector */}
              <div className="form-group">
                <label className="form-label-caps">Currency</label>
                <div className="currency-pill-grid">
                  {Object.keys(ministryData.currencies).map((currKey) => (
                    <button
                      key={currKey}
                      type="button"
                      className={`curr-pill-btn ${currency === currKey ? 'active' : ''}`}
                      onClick={() => {
                        setCurrency(currKey);
                        setSelectedPreset(presetsByCurrency[currKey][1]);
                        setCustomAmount('');
                      }}
                    >
                      {currKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="form-group">
                <label className="form-label-caps">Amount</label>
                <div className="amount-grid">
                  {currentPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-card ${selectedPreset === amt && !customAmount ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedPreset(amt);
                        setCustomAmount('');
                      }}
                    >
                      {symbol}{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="custom-amount-wrap">
                  <span className="input-prefix">{symbol}</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom amount"
                    className="custom-amount-input"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPreset(null);
                    }}
                  />
                </div>
              </div>

              {/* Fund Designation */}
              <div className="form-group">
                <label className="form-label-caps">Designate To Fund</label>
                <select
                  className="form-select"
                  value={designatedFund}
                  onChange={(e) => setDesignatedFund(e.target.value)}
                >
                  <option value="General Ministry Fund — Where the need is greatest">
                    General Ministry Fund — Where the need is greatest
                  </option>
                  <option value="Pastoral Counseling & Grief Support Fund">
                    Pastoral Counseling & Grief Support Fund
                  </option>
                  <option value="Free Devotional Book Distribution">
                    Free Devotional Book Distribution
                  </option>
                  <option value="Nigeria Youth Outreach — programmes in Lagos">
                    Nigeria Youth Outreach — programmes in Lagos
                  </option>
                </select>
              </div>

              {/* Donor fields */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    className="form-input"
                    disabled={isAnonymous}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>
                <div className="form-group flex-1">
                  <input
                    type="email"
                    required
                    placeholder="Email for receipt"
                    className="form-input"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
              </div>

              <label className="checkbox-label mb-6">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Give anonymously (no public receipt will be sent)</span>
              </label>

              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={handleStartGive}
              >
                <span>Give {symbol}{(activeAmount || 50).toLocaleString()}</span>
              </button>

              <p className="give-form-footer-note">
                You'll receive bank transfer details and an official tax receipt reference on the next step — Naira for Nigeria, USD or GBP from anywhere else.
              </p>
            </div>

            {/* Right Column: Bank Details & Benefit Cards */}
            <div className="give-info-column">
              {/* Dynamic Bank Account Card */}
              <div className="bank-account-feature-card">
                <div className="bank-card-icon-title">
                  <div className="icon-circle">
                    <Building2 size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="bank-card-header-title">{bankInfo.currencyName}</h3>
                    <p className="bank-card-header-sub">Send {currency} by wire or transfer from anywhere in the world.</p>
                  </div>
                </div>

                <div className="bank-detail-rows">
                  <div className="detail-item">
                    <span className="detail-label">ACCOUNT NAME</span>
                    <div className="detail-val-row">
                      <strong className="detail-val">{bankInfo.accountName}</strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">ACCOUNT NUMBER</span>
                    <div className="detail-val-row">
                      <strong className="detail-val mono text-gold">{bankInfo.accountNumber}</strong>
                      <button className="copy-link-btn" onClick={copyBankInfo}>
                        {copiedBank ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
                        <span>{copiedBank ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">BANK</span>
                    <div className="detail-val-row">
                      <span className="detail-val">{bankInfo.bankName}</span>
                    </div>
                  </div>

                  {bankInfo.swiftBic && (
                    <div className="detail-item">
                      <span className="detail-label">SWIFT / BIC</span>
                      <div className="detail-val-row">
                        <span className="detail-val mono">{bankInfo.swiftBic}</span>
                        <button className="copy-link-btn" onClick={() => {
                          navigator.clipboard.writeText(bankInfo.swiftBic);
                          alert("SWIFT copied!");
                        }}>
                          <Copy size={14} />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bank-card-narration-hint">
                  Add your name or gift reference as the transfer narration so we can match your gift.
                </div>
              </div>

              {/* 3 Pillar Info Cards */}
              <div className="pillar-info-card">
                <div className="pillar-icon-badge">
                  <Globe size={18} className="text-gold" />
                </div>
                <div>
                  <h4>Give in your currency</h4>
                  <p>
                    Nigerian donors transfer in Naira to our Access Bank account. 
                    Donors abroad send USD or GBP to the same ministry's domiciliary account.
                  </p>
                </div>
              </div>

              <div className="pillar-info-card">
                <div className="pillar-icon-badge">
                  <ShieldCheck size={18} className="text-teal" />
                </div>
                <div>
                  <h4>Direct to the ministry</h4>
                  <p>
                    Transfers go straight into the ministry account. Use the reference shown after 
                    you submit so your gift is matched and receipted.
                  </p>
                </div>
              </div>

              <div className="pillar-info-card">
                <div className="pillar-icon-badge">
                  <Sparkles size={18} className="text-gold" />
                </div>
                <div>
                  <h4>Where it goes</h4>
                  <p>
                    Every fund is spent on the purpose you designate. Impact reports are published each quarter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
