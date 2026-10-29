import { queryDb } from './db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dbResult = await queryDb(`
      SELECT 
        (SELECT COUNT(*) FROM prayer_requests) as total_prayers,
        (SELECT COUNT(*) FROM prayer_requests WHERE status = 'needs_prayer') as pending_prayers,
        (SELECT COUNT(*) FROM donations) as total_donations,
        (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE currency = 'NGN') as sum_ngn,
        (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE currency = 'USD') as sum_usd,
        (SELECT COUNT(*) FROM books) as total_books,
        (SELECT COUNT(*) FROM videos) as total_videos,
        (SELECT COUNT(*) FROM audio_teachings) as total_audio
    `);

    if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
      const stats = dbResult.rows[0];
      return res.status(200).json({
        success: true,
        source: 'database',
        stats: {
          prayersCount: parseInt(stats.total_prayers, 10),
          needsPrayerCount: parseInt(stats.pending_prayers, 10),
          donationsCount: parseInt(stats.total_donations, 10),
          totalDonations: {
            NGN: parseFloat(stats.sum_ngn),
            USD: parseFloat(stats.sum_usd)
          },
          booksCount: parseInt(stats.total_books, 10),
          videosCount: parseInt(stats.total_videos, 10),
          audioCount: parseInt(stats.total_audio, 10)
        }
      });
    }

    // Default response when database is not yet connected
    return res.status(200).json({
      success: true,
      source: 'sanctuary_memory',
      message: 'Database ready. Connect DATABASE_URL in Vercel to activate live persistence.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
