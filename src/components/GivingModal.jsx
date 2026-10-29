import React, { useState } from 'react';
import { 
  X, Heart, ShieldCheck, Check, Copy, ArrowRight, 
  CreditCard, Building2, Sparkles, Download, Printer 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ministryData } from '../data/ministryData';
import { adminStore } from '../data/adminStore';

export default function GivingModal({ isOpen, onClose, currency, setCurrency }) {
  const [giveFrequency, setGiveFrequency] = useState('one-time'); // one-time, monthly
  const [selectedPreset, setSelectedPreset] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [designatedFund, setDesignatedFund] = useState('General Ministry Fund — Where the need is greatest');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, transfer
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

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

  const copyBankDetails = () => {
    navigator.clipboard.writeText(`${bankInfo.bankName}\nAccount: ${bankInfo.accountNumber}\nName: ${bankInfo.accountName}\nSWIFT: ${bankInfo.swiftBic || ''}`);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDonation = adminStore.recordDonation({
      donorName: isAnonymous ? 'Anonymous Seeker' : (donorName || 'Generous Supporter'),
      email: isAnonymous ? '' : donorEmail,
      fund: designatedFund,
      amount: activeAmount,
      currency: currency,
      paymentMethod: paymentMethod === 'card' ? 'Online Card / USSD' : `Direct Bank Transfer (${bankInfo.bankName})`
    });
    setReceiptNumber(newDonation.receiptCode);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#1D7082', '#FFFFFF', '#F0C952']
      });
    } catch {
      // ignore
    }
  };

  const getImpactMessage = (amt) => {
    if (currency === 'NGN') {
      if (amt < 10000) return "Sponsors 1 printed devotional book for a youth reader who cannot pay.";
      if (amt < 30000) return "Supports a full week of confidential pastoral & grief counseling hours in Lagos.";
      return "Sustains community youth mentorship and community outreach in Lagos.";
    } else {
      if (amt <= 25) return "Sponsors 3 copies of 'The Defining Path' for readers unable to purchase.";
      if (amt <= 75) return "Funds 2 hours of professional pastoral counseling and prayer support.";
      return "Directly sponsors international digital translation and Lagos youth centre activities.";
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="giving-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-badge-row">
            <span className="eyebrow">Sow a Seed</span>
          </div>
          <h2 className="modal-title">Every Gift Becomes a Quiet Act of Ministry</h2>
          <p className="modal-subtitle">
            Choose your currency, amount, and designated fund. We handle the receipt and the work.
          </p>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {!isSubmitted ? (
          <form className="giving-form" onSubmit={handleSubmit}>
            {/* Frequency Toggle */}
            <div className="giving-toggle-pill">
              <button
                type="button"
                className={`pill-btn ${giveFrequency === 'one-time' ? 'active' : ''}`}
                onClick={() => setGiveFrequency('one-time')}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                className={`pill-btn ${giveFrequency === 'monthly' ? 'active' : ''}`}
                onClick={() => setGiveFrequency('monthly')}
              >
                Monthly Covenant Partner
              </button>
            </div>

            {/* Currency Selector Buttons */}
            <div className="form-group">
              <label className="form-label">Select Giving Currency</label>
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
                    <span className="font-semibold">{currKey}</span> ({ministryData.currencies[currKey].symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Presets */}
            <div className="form-group">
              <label className="form-label">Select Amount ({symbol})</label>
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
                    <span className="amount-val">{symbol}{amt.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              {/* Custom Amount input */}
              <div className="custom-amount-wrap">
                <span className="input-prefix">{symbol}</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="Or enter custom amount"
                  className="custom-amount-input"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPreset(null);
                  }}
                />
              </div>

              <div className="impact-statement">
                <Sparkles size={14} className="text-gold" />
                <span>{getImpactMessage(activeAmount || 50)}</span>
              </div>
            </div>

            {/* Fund Designation */}
            <div className="form-group">
              <label className="form-label">Designate To Fund</label>
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
                  Free Devotional Book Distribution (for students & prisoners)
                </option>
                <option value="Nigeria Youth Outreach — Programmes in Lagos">
                  Nigeria Youth Outreach — Programmes in Lagos
                </option>
              </select>
            </div>

            {/* Payment Method Switch */}
            <div className="form-group">
              <label className="form-label">Preferred Method</label>
              <div className="payment-method-selector">
                <button
                  type="button"
                  className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={16} />
                  <span>Debit / Credit Card</span>
                </button>
                <button
                  type="button"
                  className={`method-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('transfer')}
                >
                  <Building2 size={16} />
                  <span>Direct Bank Wire ({currency})</span>
                </button>
              </div>
            </div>

            {/* Bank details if Transfer is picked */}
            {paymentMethod === 'transfer' ? (
              <div className="bank-details-box animate-fade-in">
                <div className="bank-box-header">
                  <span className="font-semibold">{bankInfo.currencyName}</span>
                  <button type="button" className="copy-btn-mini" onClick={copyBankDetails}>
                    {copiedAccount ? <Check size={13} className="text-teal" /> : <Copy size={13} />}
                    <span>{copiedAccount ? "Copied" : "Copy All"}</span>
                  </button>
                </div>
                <div className="bank-meta-table">
                  <div className="table-row">
                    <span>Account Name:</span>
                    <strong>{bankInfo.accountName}</strong>
                  </div>
                  <div className="table-row">
                    <span>Account Number:</span>
                    <strong className="mono font-bold text-gold">{bankInfo.accountNumber}</strong>
                  </div>
                  <div className="table-row">
                    <span>Bank:</span>
                    <span>{bankInfo.bankName}</span>
                  </div>
                  {bankInfo.swiftBic && (
                    <div className="table-row">
                      <span>SWIFT / BIC:</span>
                      <span className="mono">{bankInfo.swiftBic}</span>
                    </div>
                  )}
                </div>
                <p className="bank-transfer-note">{bankInfo.note}</p>
              </div>
            ) : null}

            {/* Donor info */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sister Mary or Brother John"
                  className="form-input"
                  disabled={isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Email for Tax Receipt</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="form-input"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>Give anonymously (receipt will still be emailed privately)</span>
            </label>

            {/* Submit CTA */}
            <button type="submit" className="btn btn-gold btn-lg w-full submit-give-btn">
              <Heart size={18} />
              <span>
                {paymentMethod === 'card'
                  ? `Give ${symbol}${(activeAmount || 50).toLocaleString()} Now`
                  : `I Have Completed the ${symbol}${(activeAmount || 50).toLocaleString()} Transfer`}
              </span>
              <ArrowRight size={18} />
            </button>

            <div className="security-notice">
              <ShieldCheck size={14} className="text-gold" />
              <span>
                Encrypted with 256-bit SSL. Receipts issued by The Defining Place for Rest International Ministries.
              </span>
            </div>
          </form>
        ) : (
          /* Confirmation & Official Receipt View */
          <div className="receipt-view animate-fade-in">
            <div className="receipt-badge">
              <Check size={28} className="text-teal" />
            </div>
            <h3 className="receipt-heading">May the Lord Replenish Your Storehouse</h3>
            <p className="receipt-subheading">
              Your gift of <strong>{symbol}{(activeAmount || 50).toLocaleString()}</strong> ({giveFrequency}) 
              has been dedicated to the <strong>{designatedFund}</strong>.
            </p>

            <div className="official-receipt-card">
              <div className="receipt-card-header">
                <div>
                  <h4 className="receipt-brand">THE ALTAR</h4>
                  <p className="receipt-brand-sub">Official Charitable Donation Receipt</p>
                </div>
                <div className="receipt-ref-block">
                  <span className="ref-label">Reference No.</span>
                  <span className="ref-val mono">{receiptNumber}</span>
                </div>
              </div>

              <div className="receipt-body">
                <div className="receipt-line">
                  <span>Donor:</span>
                  <strong>{isAnonymous ? "Anonymous Servant of God" : (donorName || "Faithful Partner")}</strong>
                </div>
                <div className="receipt-line">
                  <span>Email:</span>
                  <span>{donorEmail}</span>
                </div>
                <div className="receipt-line">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="receipt-line">
                  <span>Amount:</span>
                  <strong className="text-gold text-lg">{symbol}{(activeAmount || 50).toLocaleString()}</strong>
                </div>
                <div className="receipt-line">
                  <span>Fund:</span>
                  <span>{designatedFund}</span>
                </div>
              </div>

              <div className="receipt-blessing">
                “Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.” — 2 Cor 9:7
              </div>
            </div>

            <div className="receipt-actions">
              <button className="btn btn-outline" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Print Official Receipt</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
              >
                <span>Return to Sanctuary</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
