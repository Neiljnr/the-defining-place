import React, { useState } from 'react';
import { X, BookOpen, Download, Type, Moon, Sun, Bookmark, ShoppingBag, ArrowRight } from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function SampleReaderModal({ book, onClose, openGivingModal, currency }) {
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large
  const [readerTheme, setReaderTheme] = useState('parchment'); // parchment, pure, midnight
  const [hasBookmarked, setHasBookmarked] = useState(false);

  if (!book) return null;

  const priceObj = ministryData.currencies[currency];
  const convertedPrice = currency === 'NGN' 
    ? `₦${book.priceNGN.toLocaleString()}` 
    : `${priceObj.symbol}${(book.priceUSD * (currency === 'USD' ? 1 : priceObj.rate)).toFixed(2)}`;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className={`reader-modal-container reader-theme-${readerTheme}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reader Top Toolbar */}
        <header className="reader-toolbar">
          <div className="reader-meta">
            <span className="reader-badge">
              <BookOpen size={14} className="text-gold" />
              <span>Sample Excerpt</span>
            </span>
            <span className="reader-book-title">{book.title}</span>
          </div>

          <div className="reader-controls">
            {/* Font Size Selector */}
            <div className="reader-control-group">
              <button 
                className={`reader-tool-btn ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => setFontSize('small')}
                title="Small text"
              >
                A-
              </button>
              <button 
                className={`reader-tool-btn ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => setFontSize('medium')}
                title="Normal text"
              >
                A
              </button>
              <button 
                className={`reader-tool-btn ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => setFontSize('large')}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Reader Theme */}
            <div className="reader-control-group">
              <button 
                className={`reader-theme-swatch swatch-parchment ${readerTheme === 'parchment' ? 'active' : ''}`}
                onClick={() => setReaderTheme('parchment')}
                title="Parchment Sepia"
              />
              <button 
                className={`reader-theme-swatch swatch-pure ${readerTheme === 'pure' ? 'active' : ''}`}
                onClick={() => setReaderTheme('pure')}
                title="Pure White"
              />
              <button 
                className={`reader-theme-swatch swatch-midnight ${readerTheme === 'midnight' ? 'active' : ''}`}
                onClick={() => setReaderTheme('midnight')}
                title="Midnight Sanctuary"
              />
            </div>

            {/* Bookmark button */}
            <button 
              className={`reader-tool-btn ${hasBookmarked ? 'text-gold active' : ''}`}
              onClick={() => setHasBookmarked(!hasBookmarked)}
              title={hasBookmarked ? "Chapter bookmarked" : "Bookmark chapter"}
            >
              <Bookmark size={15} fill={hasBookmarked ? "currentColor" : "none"} />
            </button>

            {/* Close */}
            <button className="reader-close-btn" onClick={onClose} title="Close reader">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Reader Content Body */}
        <article className={`reader-article font-size-${fontSize}`}>
          <div className="reader-book-header">
            <span className="reader-author-eyebrow">A Teaching by {book.author}</span>
            <h1 className="reader-main-title">{book.title}</h1>
            <h2 className="reader-chapter-title">{book.sampleChapter.title}</h2>
            {book.sampleChapter.epigraph && (
              <blockquote className="reader-epigraph">
                {book.sampleChapter.epigraph}
              </blockquote>
            )}
            <div className="reader-ornament">✦ ✦ ✦</div>
          </div>

          <div className="reader-prose">
            {book.sampleChapter.paragraphs.map((p, idx) => (
              <p key={idx} className={idx === 0 ? "drop-cap-paragraph" : ""}>
                {p}
              </p>
            ))}
          </div>

          <div className="reader-completion-box">
            <div className="completion-icon">
              <BookOpen size={28} className="text-gold" />
            </div>
            <h3>End of Sample Preview</h3>
            <p>
              Continue reading the complete work. Includes full chapters, pastoral study reflections, 
              and author's personal benedictions.
            </p>
            <div className="completion-actions">
              <button 
                className="btn btn-gold"
                onClick={() => {
                  alert(`Thank you! "${book.title}" digital edition (${convertedPrice}) has been selected for download.`);
                  onClose();
                }}
              >
                <ShoppingBag size={16} />
                <span>Get Complete Book ({convertedPrice})</span>
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => window.print()}
              >
                <Download size={16} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
