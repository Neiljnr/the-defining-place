import { queryDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || (req.body && req.body.action);

  // 1. Google One-Tap / OAuth Sign-In (Gmail)
  if (req.method === 'POST' && action === 'google') {
    try {
      const { email, name, avatarUrl } = req.body || {};
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
      }

      // Check if user exists
      const existing = await queryDb('SELECT * FROM sanctuary_users WHERE email = $1', [email.toLowerCase().trim()]);
      
      let user = null;
      if (existing.rows.length > 0) {
        user = existing.rows[0];
        // Update last login & avatar
        await queryDb(
          'UPDATE sanctuary_users SET last_login = CURRENT_TIMESTAMP, avatar_url = COALESCE($1, avatar_url) WHERE id = $2',
          [avatarUrl || user.avatar_url, user.id]
        );
      } else {
        // Create minimal user
        const id = `usr_g_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const displayName = name || email.split('@')[0];
        const insertRes = await queryDb(
          `INSERT INTO sanctuary_users (id, name, email, avatar_url, auth_provider)
           VALUES ($1, $2, $3, $4, 'google')
           RETURNING id, name, email, avatar_url, auth_provider, created_at`,
          [id, displayName, email.toLowerCase().trim(), avatarUrl || '']
        );
        user = insertRes.rows[0];
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
          authProvider: 'google'
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Normal Sign-Up (Minimal: Name, Email, Password)
  if (req.method === 'POST' && action === 'register') {
    try {
      const { name, email, password } = req.body || {};
      if (!email || !name) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
      }

      // Check if email already taken
      const existing = await queryDb('SELECT id FROM sanctuary_users WHERE email = $1', [email.toLowerCase().trim()]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists. Please sign in.' });
      }

      const id = `usr_e_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const insertRes = await queryDb(
        `INSERT INTO sanctuary_users (id, name, email, password_hash, auth_provider)
         VALUES ($1, $2, $3, $4, 'email')
         RETURNING id, name, email, avatar_url, auth_provider, created_at`,
        [id, name.trim(), email.toLowerCase().trim(), password || '']
      );

      const user = insertRes.rows[0];
      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
          authProvider: 'email'
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Normal Sign-In
  if (req.method === 'POST' && action === 'login') {
    try {
      const { email, password } = req.body || {};
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
      }

      const result = await queryDb('SELECT * FROM sanctuary_users WHERE email = $1', [email.toLowerCase().trim()]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'No account found with this email. Please sign up.' });
      }

      const user = result.rows[0];
      // Check password if set
      if (user.password_hash && password && user.password_hash !== password) {
        return res.status(401).json({ success: false, error: 'Incorrect passcode.' });
      }

      // Update last login
      await queryDb('UPDATE sanctuary_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
          authProvider: user.auth_provider
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(400).json({ error: 'Invalid auth action' });
}
