import { queryDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type } = req.query; // 'videos', 'books', 'audio', 'daily_word'

  // GET: Fetch catalog
  if (req.method === 'GET') {
    try {
      if (type === 'videos') {
        const result = await queryDb('SELECT * FROM videos WHERE is_published = TRUE ORDER BY created_at DESC');
        return res.status(200).json({ success: true, videos: result?.rows || [] });
      }
      if (type === 'books') {
        const result = await queryDb('SELECT * FROM books WHERE is_published = TRUE ORDER BY created_at DESC');
        return res.status(200).json({ success: true, books: result?.rows || [] });
      }
      if (type === 'audio') {
        const result = await queryDb('SELECT * FROM audio_teachings WHERE is_published = TRUE ORDER BY created_at DESC');
        return res.status(200).json({ success: true, audio: result?.rows || [] });
      }
      if (type === 'daily_word') {
        const result = await queryDb('SELECT * FROM daily_scriptures WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1');
        return res.status(200).json({ success: true, dailyScripture: result?.rows?.[0] || null });
      }

      return res.status(200).json({
        success: true,
        endpoints: ['/api/content?type=videos', '/api/content?type=books', '/api/content?type=audio', '/api/content?type=daily_word']
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Pastor publishes new video, book, or audio
  if (req.method === 'POST') {
    try {
      const data = req.body || {};

      if (type === 'videos') {
        const id = data.id || `video-${Date.now()}`;
        const result = await queryDb(
          `INSERT INTO videos (id, title, series, video_url, thumbnail_url, duration, key_scripture, description, speaker)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [id, data.title, data.series || 'Sunday Service', data.videoUrl || '', data.thumbnail || '', data.duration || '35 min', data.scripture || '', data.description || '', data.speaker || 'Rev. Tresh']
        );
        return res.status(201).json({ success: true, video: result?.rows?.[0] || data });
      }

      if (type === 'books') {
        const id = data.id || `book-${Date.now()}`;
        const result = await queryDb(
          `INSERT INTO books (id, title, subtitle, cover_image_url, price_ngn, price_usd, synopsis, sample_chapter_title, sample_chapter_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [id, data.title, data.subtitle || '', data.coverImage || '', data.priceNGN || 6000, data.priceUSD || 12, data.synopsis || '', data.sampleChapterTitle || '', data.sampleChapterText || '']
        );
        return res.status(201).json({ success: true, book: result?.rows?.[0] || data });
      }

      if (type === 'audio') {
        const id = data.id || `audio-${Date.now()}`;
        const result = await queryDb(
          `INSERT INTO audio_teachings (id, title, series, speaker, duration, audio_url, scripture, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [id, data.title, data.series || '', data.speaker || 'Rev. Tresh', data.duration || '30 min', data.audioUrl || '', data.scripture || '', data.description || '']
        );
        return res.status(201).json({ success: true, audio: result?.rows?.[0] || data });
      }

      if (type === 'daily_word') {
        await queryDb('UPDATE daily_scriptures SET is_active = FALSE');
        const result = await queryDb(
          `INSERT INTO daily_scriptures (verse_text, reference, reflection, is_active)
           VALUES ($1, $2, $3, TRUE)
           RETURNING *`,
          [data.verse, data.reference, data.reflection || '']
        );
        return res.status(201).json({ success: true, dailyScripture: result?.rows?.[0] || data });
      }

      return res.status(400).json({ error: 'Invalid content type' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
