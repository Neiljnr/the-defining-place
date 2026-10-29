import React, { useState } from 'react';
import { BookOpen, ShoppingBag, Star, Download, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { ministryData } from '../data/ministryData';

export default function BooksView({ openReaderModal, openGivingModal, currency }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const currencyObj = ministryData.currencies[currency];

  const formatPrice = (usd, ngn) => {
    if (currency === 'NGN') return `₦${ngn.toLocaleString()}`;
    const rate = currencyObj.rate || 1;
    return `${currencyObj.symbol}${(usd * rate).toFixed(2)}`;
  };

  const categories = [
    { id: 'all', label: 'All Titles' },
    { id: 'devotional', label: 'Devotionals' },
    { id: 'essays', label: 'Spiritual Essays' },
    { id: 'sample', label: 'Free Sample Available' }
  ];

  return (
    <div className="books-view animate-fade-in">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container text-center">
          <span className="eyebrow">The Bookshelf</span>
          <h1 className="page-title">Books written to meet you where you are.</h1>
          <p className="page-subtitle">
            Every title includes a free sample chapter. Purchase once and read instantly 
            in your browser, or download PDF and EPUB to keep.
          </p>

          {/* Filter Pills */}
          <div className="filter-pills-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${filterCategory === cat.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="section-spacing pt-0">
        <div className="container">
          <div className="books-catalog-grid">
            {ministryData.books.map((book) => (
              <div key={book.id} className="book-catalog-card">
                <div className="book-catalog-media">
                  <div className="book-cover-3d-wrap">
                    <img src={book.coverImage} alt={book.title} className="catalog-cover-img" />
                  </div>
                  <div className="media-overlay-actions">
                    <button 
                      className="btn btn-gold btn-sm w-full"
                      onClick={() => openReaderModal(book)}
                    >
                      <BookOpen size={15} />
                      <span>Read Free Sample</span>
                    </button>
                  </div>
                </div>

                <div className="book-catalog-details">
                  <div className="book-badge-row">
                    <span className="book-status-tag">{book.status}</span>
                    <div className="star-rating">
                      <Star size={14} className="fill-gold text-gold" />
                      <span>{book.rating} ({book.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h2 className="catalog-book-title">{book.title}</h2>
                  <p className="catalog-book-subtitle">{book.subtitle}</p>
                  <p className="catalog-book-synopsis">{book.synopsis}</p>

                  <div className="catalog-specs-row">
                    <span><strong>Pages:</strong> {book.pages}</span>
                    <span><strong>Formats:</strong> {book.formats.join(', ')}</span>
                  </div>

                  <div className="catalog-card-footer">
                    <div className="price-stack">
                      <span className="price-label">Complete Edition</span>
                      <span className="price-amount font-bold text-gold">
                        {formatPrice(book.priceUSD, book.priceNGN)}
                      </span>
                    </div>

                    <div className="action-buttons-group">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => openReaderModal(book)}
                        title="Read sample in browser"
                      >
                        <BookOpen size={14} />
                        <span>Sample</span>
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          alert(`Thank you! "${book.title}" added to your digital sanctuary. Instant download initiated.`);
                        }}
                      >
                        <Download size={14} />
                        <span>Get Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsoring Devotionals Banner */}
          <div className="sponsor-books-strip">
            <div className="sponsor-text">
              <Sparkles size={24} className="text-gold" />
              <div>
                <h3>Sponsor Devotionals for Readers in Need</h3>
                <p>
                  Every month, The Defining Place provides hundreds of physical and digital copies 
                  free of charge to students, prison inmates, and readers across Nigeria who cannot afford them.
                </p>
              </div>
            </div>
            <button className="btn btn-gold" onClick={() => openGivingModal()}>
              <span>Sponsor a Book Fund</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
