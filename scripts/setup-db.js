import { neon, Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env' });
}

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.error('ERROR: No DATABASE_URL found in .env.local or .env');
  process.exit(1);
}

console.log('Connecting to Neon PostgreSQL on branch:', process.env.NEON_BRANCH || 'production');
console.log('Host:', new URL(connectionString.replace('postgresql://', 'http://')).host);

async function setupDatabase() {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    // 1. Read schema.sql
    const schemaSql = fs.readFileSync('database/schema.sql', 'utf8');
    console.log('\n--- 1. Creating Database Tables & Indexes ---');
    await client.query(schemaSql);
    console.log('✓ All 8 Sanctuary tables and indexes created successfully.');

    // 2. Check and Seed Books
    console.log('\n--- 2. Seeding Sanctuary Books ---');
    const existingBooks = await client.query('SELECT COUNT(*) FROM books');
    if (parseInt(existingBooks.rows[0].count, 10) === 0) {
      const booksToSeed = [
        {
          id: 'the-defining-path',
          title: 'The Defining Path',
          subtitle: 'Navigating Spiritual Transitions with Unwavering Stillness',
          cover: '/images/book-defining-path.jpg',
          price_ngn: 5500,
          price_usd: 12.00,
          synopsis: 'A gentle yet profound compass for the soul in an era of relentless speed, comparison, and noise.',
          sample_title: 'Chapter 1: The Altar Before the Assignment',
          sample_text: 'We live in a culture that measures life by velocity. If your calendar is full, society assumes your life is significant. At the altar, nothing is produced. Nothing is negotiated. The altar is simply the place where the striving human will ceases its frantic defense and yields to a greater Love.'
        },
        {
          id: 'quiet-waters',
          title: 'Quiet Waters',
          subtitle: 'Finding Stillness in a Restless World',
          cover: '/images/book-quiet-waters.jpg',
          price_ngn: 4200,
          price_usd: 9.00,
          synopsis: 'Drawn from Psalm 23, exploring the spiritual discipline of soul-restoration.',
          sample_title: 'Chapter 1: The Rest You Cannot Earn',
          sample_text: 'There is a deep difference between physical exhaustion and a thirsty spirit. You can sleep ten hours and still awaken with an aching emptiness behind your ribs. Sleep rejuvenates the body; only sacred stillness restores the soul.'
        },
        {
          id: 'redemption-song',
          title: 'Redemption Song',
          subtitle: 'Restored. Redeemed. Renewed.',
          cover: '/images/book-redemption-song.jpg',
          price_ngn: 6000,
          price_usd: 15.00,
          synopsis: 'A tender exploration of grief, broken dreams, and resurrection joy.',
          sample_title: 'Chapter 1: Beauty from Ash in Ordinary Hours',
          sample_text: 'Human beings are prone to hide what has been scorched. Yet redemption is not about cosmetic concealment. In the hands of the Redeemer, ash is the very ingredient of revival.'
        },
        {
          id: 'echoes-of-hope',
          title: 'Echoes of Hope',
          subtitle: 'A Daily Spiritual Devotional for the Soul',
          cover: '/images/book-echoes-hope.jpg',
          price_ngn: 6500,
          price_usd: 16.00,
          synopsis: '365 daily contemplations and breath prayers designed for morning devotion.',
          sample_title: 'Day 1: The Light That Precedes the Dawn',
          sample_text: 'Before the sun breaks above the Lagos skyline, there is a twilight hush where birds begin their first tentative notes. Faith is singing in the twilight.'
        }
      ];

      for (const b of booksToSeed) {
        await client.query(
          `INSERT INTO books (id, title, subtitle, cover_image_url, price_ngn, price_usd, synopsis, sample_chapter_title, sample_chapter_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [b.id, b.title, b.subtitle, b.cover, b.price_ngn, b.price_usd, b.synopsis, b.sample_title, b.sample_text]
        );
      }
      console.log(`✓ Seeded ${booksToSeed.length} books.`);
    } else {
      console.log(`✓ Books already populated (${existingBooks.rows[0].count} found).`);
    }

    // 3. Check and Seed Videos
    console.log('\n--- 3. Seeding Video Sermons ---');
    const existingVideos = await client.query('SELECT COUNT(*) FROM videos');
    if (parseInt(existingVideos.rows[0].count, 10) === 0) {
      const videosToSeed = [
        {
          id: 'sunday-service-altar',
          title: 'Sunday Service — The ALTAR',
          series: 'Sunday Gatherings',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: '/images/video-service.jpg',
          duration: '1 hr 12 min',
          scripture: 'Hebrews 4:9-11',
          description: 'Full service recording from our Lagos gathering. Includes acoustic worship, communal prayer, and Rev. Tresh\'s message on Entering Into His Rest.',
          speaker: 'Rev. Tresh'
        },
        {
          id: 'rest-for-the-weary',
          title: 'Rest for the Weary',
          series: 'Study Series',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: '/images/video-weary.jpg',
          duration: '18 min',
          scripture: 'Matthew 11:28-30',
          description: 'A quiet, tender devotional teaching filmed in Rev. Tresh\'s study for anyone carrying more grief, financial pressure, or family strain than they can name.',
          speaker: 'Rev. Tresh'
        },
        {
          id: 'counsel-and-prayer-night',
          title: 'Counsel & Prayer Night',
          series: 'Prayer Vigil',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: '/images/video-prayer.jpg',
          duration: '45 min',
          scripture: 'Psalm 139:1-12',
          description: 'Highlights and pastoral counsel from our monthly gathering in Lagos. Exploring how God speaks through quiet counsel and answered prayers.',
          speaker: 'Rev. Tresh & Counseling Team'
        }
      ];

      for (const v of videosToSeed) {
        await client.query(
          `INSERT INTO videos (id, title, series, video_url, thumbnail_url, duration, key_scripture, description, speaker)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [v.id, v.title, v.series, v.video_url, v.thumbnail, v.duration, v.scripture, v.description, v.speaker]
        );
      }
      console.log(`✓ Seeded ${videosToSeed.length} video sermons.`);
    } else {
      console.log(`✓ Videos already populated (${existingVideos.rows[0].count} found).`);
    }

    // 4. Check and Seed Audio Teachings
    console.log('\n--- 4. Seeding Audio Teachings ---');
    const existingAudio = await client.query('SELECT COUNT(*) FROM audio_teachings');
    if (parseInt(existingAudio.rows[0].count, 10) === 0) {
      const audiosToSeed = [
        { id: 'altar-of-rest', title: 'The Altar of Rest', series: 'Foundational Teachings', speaker: 'Rev. Tresh', duration: '38 min', scripture: 'Matthew 11:28-30', audio_url: 'ambient_rest' },
        { id: 'defined-not-drained', title: 'Defined, Not Drained', series: 'Soul Care & Ministry', speaker: 'Rev. Tresh', duration: '31 min', scripture: 'Galatians 1:10', audio_url: 'ambient_defined' },
        { id: 'quiet-obedience', title: 'Quiet Obedience', series: 'Walking in Faith', speaker: 'Rev. Tresh', duration: '27 min', scripture: '1 Kings 19:11-13', audio_url: 'ambient_obedience' },
        { id: 'when-night-is-long', title: 'When the Night is Long', series: 'Valley Whispers', speaker: 'Rev. Tresh', duration: '42 min', scripture: 'Psalm 139:11-12', audio_url: 'ambient_night' }
      ];

      for (const a of audiosToSeed) {
        await client.query(
          `INSERT INTO audio_teachings (id, title, series, speaker, duration, scripture, audio_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [a.id, a.title, a.series, a.speaker, a.duration, a.scripture, a.audio_url]
        );
      }
      console.log(`✓ Seeded ${audiosToSeed.length} audio teachings.`);
    } else {
      console.log(`✓ Audio teachings already populated (${existingAudio.rows[0].count} found).`);
    }

    // 5. Check and Seed Daily Scripture
    console.log('\n--- 5. Seeding Daily Word Scripture ---');
    const existingWord = await client.query('SELECT COUNT(*) FROM daily_scriptures');
    if (parseInt(existingWord.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO daily_scriptures (verse_text, reference, reflection, is_active)
         VALUES ($1, $2, $3, TRUE)`,
        [
          'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
          'Psalm 46:10',
          'God asks for stillness before He reveals His strength.'
        ]
      );
      console.log('✓ Seeded active Daily Word verse.');
    } else {
      console.log(`✓ Daily scripture already exists (${existingWord.rows[0].count} found).`);
    }

    // 6. Check and Seed Initial Prayer Requests & Donations
    console.log('\n--- 6. Seeding Initial Prayer Requests & Donations ---');
    const existingPrayers = await client.query('SELECT COUNT(*) FROM prayer_requests');
    if (parseInt(existingPrayers.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO prayer_requests (tracking_code, name, email, phone, category, message, urgency, status, pastor_notes)
         VALUES 
         ('ALTAR-98214', 'Brother Babatunde A.', 'babatunde@example.com', '+234 803 123 4567', 'Spiritual Direction & Calling', 'Seeking clarity regarding a career relocation and church planting effort in Ibadan.', 'high', 'needs_prayer', 'Interceding in morning altar.'),
         ('ALTAR-77412', 'Sister Folashade M.', 'folashade@example.com', '+234 809 887 6543', 'Emotional Solace & Healing', 'Walking through deep grief after loss of my mother. Praying for peace.', 'standard', 'interceding', 'Prayed during vigil. Sent comfort devotional.'),
         ('ALTAR-33981', 'Grace O.', 'grace@example.com', '', 'Family Peace & Reconciliation', 'Reconciliation with my brother before father''s anniversary.', 'standard', 'answered', 'Grace confirmed reconciliation! Praise God.')`
      );
      console.log('✓ Seeded initial prayer inquiries.');
    } else {
      console.log(`✓ Prayer requests already exist (${existingPrayers.rows[0].count} found).`);
    }

    const existingDonations = await client.query('SELECT COUNT(*) FROM donations');
    if (parseInt(existingDonations.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO donations (receipt_code, donor_name, donor_email, fund, amount, currency, payment_method)
         VALUES
         ('ALTAR-GIV-9982', 'Elder Kunle Adeyemi', 'kunle.a@example.com', 'The Altar Book Outreach Fund', 50000, 'NGN', 'Direct Bank Transfer (Access Bank)'),
         ('ALTAR-GIV-9975', 'Sarah Jenkins', 'sarah.j@example.com', 'Quiet Waters Sanctuary & Media Fund', 150, 'USD', 'International Domiciliary Transfer'),
         ('ALTAR-GIV-9960', 'Anonymous Seeker', '', 'Pastoral Care & Youth Assistance', 100, 'GBP', 'UK FPS Transfer (Barclays)')`
      );
      console.log('✓ Seeded initial donation records.');
    } else {
      console.log(`✓ Donations already exist (${existingDonations.rows[0].count} found).`);
    }

    // 7. Verification: Run End-to-End Query Test
    console.log('\n--- 7. End-to-End Neon Query Verification ---');
    const tableCounts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM books) as books_count,
        (SELECT COUNT(*) FROM videos) as videos_count,
        (SELECT COUNT(*) FROM audio_teachings) as audio_count,
        (SELECT COUNT(*) FROM daily_scriptures) as scriptures_count,
        (SELECT COUNT(*) FROM prayer_requests) as prayers_count,
        (SELECT COUNT(*) FROM donations) as donations_count
    `);

    console.log('Neon Database Live Table Counts:');
    console.table(tableCounts.rows);

    console.log('\n✅ NEON POSTGRES SETUP & END-TO-END VERIFICATION COMPLETED SUCCESSFULLY!');
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().catch((err) => {
  console.error('Database setup failed:', err);
  process.exit(1);
});
