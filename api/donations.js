import { queryDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Record seed sown / donation
  if (req.method === 'POST') {
    try {
      const { donorName, email, phone, fund, amount, currency, paymentMethod, note } = req.body || {};
      const receiptCode = `ALTAR-GIV-${Math.floor(1000 + Math.random() * 9000)}`;

      const insertResult = await queryDb(
        `INSERT INTO donations (receipt_code, donor_name, donor_email, donor_phone, fund, amount, currency, payment_method, note)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [receiptCode, donorName || 'Anonymous Seeker', email || '', phone || '', fund || 'General Ministry', amount || 0, currency || 'NGN', paymentMethod || 'Direct Bank Transfer', note || '']
      );

      return res.status(201).json({
        success: true,
        receiptCode,
        donation: insertResult?.rows?.[0] || {
          receiptCode,
          donorName,
          fund,
          amount,
          currency,
          createdAt: new Date().toISOString()
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET: Pastor logs
  if (req.method === 'GET') {
    try {
      const result = await queryDb(`SELECT * FROM donations ORDER BY created_at DESC LIMIT 100`);
      return res.status(200).json({
        success: true,
        donations: result?.rows || []
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
