import { queryDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Public submission of prayer request
  if (req.method === 'POST') {
    try {
      const { name, email, phone, category, message, urgency } = req.body || {};
      const trackingCode = `ALTAR-${Math.floor(10000 + Math.random() * 90000)}`;

      const insertResult = await queryDb(
        `INSERT INTO prayer_requests (tracking_code, name, email, phone, category, message, urgency)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [trackingCode, name || 'Anonymous Seeker', email || '', phone || '', category || 'Spiritual Direction', message || '', urgency || 'standard']
      );

      return res.status(201).json({
        success: true,
        trackingCode,
        prayer: insertResult?.rows?.[0] || {
          trackingCode,
          name,
          email,
          category,
          message,
          status: 'needs_prayer',
          createdAt: new Date().toISOString()
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET: Pastor retrieves prayer requests
  if (req.method === 'GET') {
    try {
      const result = await queryDb(`SELECT * FROM prayer_requests ORDER BY created_at DESC LIMIT 100`);
      return res.status(200).json({
        success: true,
        prayers: result?.rows || []
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // PATCH: Pastor updates status or private intercession notes
  if (req.method === 'PATCH') {
    try {
      const { id, status, pastorNotes } = req.body || {};
      const result = await queryDb(
        `UPDATE prayer_requests 
         SET status = COALESCE($1, status), pastor_notes = COALESCE($2, pastor_notes), updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 RETURNING *`,
        [status, pastorNotes, id]
      );
      return res.status(200).json({ success: true, updated: result?.rows?.[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
