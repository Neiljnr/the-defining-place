import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env' });
}

import statsHandler from '../api/stats.js';
import contentHandler from '../api/content.js';
import prayersHandler from '../api/prayers.js';
import donationsHandler from '../api/donations.js';

// Helper to mock Vercel req/res
function createMockReqRes(method = 'GET', query = {}, body = {}) {
  const req = {
    method,
    query,
    body,
    headers: {}
  };

  let statusCode = 200;
  let responseData = null;
  const headers = {};

  const res = {
    setHeader(k, v) {
      headers[k] = v;
      return res;
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    },
    _getData() {
      return { statusCode, data: responseData, headers };
    }
  };

  return { req, res };
}

async function runEndToEndTests() {
  console.log('====================================================');
  console.log('   NEON POSTGRES END-TO-END SERVICE VERIFICATION    ');
  console.log('====================================================');
  console.log('Target Branch:', process.env.NEON_BRANCH || 'production');

  let passedTests = 0;
  let totalTests = 0;

  async function test(name, fn) {
    totalTests++;
    process.stdout.write(`Testing: ${name}... `);
    try {
      await fn();
      console.log('✅ PASSED');
      passedTests++;
    } catch (err) {
      console.log('❌ FAILED:', err.message);
    }
  }

  // 1. Stats Service
  await test('Stats Service (api/stats.js)', async () => {
    const { req, res } = createMockReqRes('GET');
    await statsHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.success) {
      throw new Error(`Unexpected response: ${JSON.stringify(result.data)}`);
    }
    if (result.data.source !== 'database') {
      throw new Error(`Expected source to be 'database', got ${result.data.source}`);
    }
    console.log(`\n   -> Retrieved ${result.data.stats.booksCount} books, ${result.data.stats.donationsCount} donations, ${result.data.stats.prayersCount} prayers from Neon.`);
  });

  // 2. Content Service - Fetch Books
  await test('Content Service - Books (api/content.js?type=books)', async () => {
    const { req, res } = createMockReqRes('GET', { type: 'books' });
    await contentHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.books || result.data.books.length === 0) {
      throw new Error('Failed to retrieve books from Neon');
    }
    console.log(`\n   -> Fetched ${result.data.books.length} books. Top book: "${result.data.books[0].title}"`);
  });

  // 3. Content Service - Fetch Videos
  await test('Content Service - Videos (api/content.js?type=videos)', async () => {
    const { req, res } = createMockReqRes('GET', { type: 'videos' });
    await contentHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.videos || result.data.videos.length === 0) {
      throw new Error('Failed to retrieve videos from Neon');
    }
    console.log(`\n   -> Fetched ${result.data.videos.length} videos. Top sermon: "${result.data.videos[0].title}"`);
  });

  // 4. Content Service - Daily Scripture
  await test('Content Service - Daily Word (api/content.js?type=daily_word)', async () => {
    const { req, res } = createMockReqRes('GET', { type: 'daily_word' });
    await contentHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.dailyScripture) {
      throw new Error('Failed to retrieve daily scripture from Neon');
    }
    console.log(`\n   -> Active Word: "${result.data.dailyScripture.reference}"`);
  });

  // 5. Prayers Service - Seeker Submission & Pastor Retrieval
  let testTrackingCode = '';
  await test('Prayers Service - Seeker Submit (POST api/prayers.js)', async () => {
    const { req, res } = createMockReqRes('POST', {}, {
      name: 'Sister Maryam K.',
      email: 'maryam.k@example.com',
      phone: '+234 802 999 1122',
      category: 'Healing & Supernatural Strength',
      message: 'Believing God for physical restoration after surgery.',
      urgency: 'high'
    });
    await prayersHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 201 || !result.data.success) {
      throw new Error('Failed to insert prayer into Neon');
    }
    testTrackingCode = result.data.trackingCode;
    console.log(`\n   -> Seeker submitted prayer with Tracking Code: ${testTrackingCode}`);
  });

  await test('Prayers Service - Pastor List (GET api/prayers.js)', async () => {
    const { req, res } = createMockReqRes('GET');
    await prayersHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.prayers) {
      throw new Error('Failed to retrieve prayers list from Neon');
    }
    const found = result.data.prayers.find(p => p.tracking_code === testTrackingCode);
    if (!found) {
      throw new Error(`Submitted prayer ${testTrackingCode} not found in database`);
    }
    console.log(`\n   -> Verified prayer ${testTrackingCode} persisted in Neon (${found.name})`);
  });

  // 6. Donations Service - Record Seed Sown
  let testReceiptCode = '';
  await test('Donations Service - Record Seed (POST api/donations.js)', async () => {
    const { req, res } = createMockReqRes('POST', {}, {
      donorName: 'Dr. Chika Okafor',
      email: 'chika.o@example.com',
      fund: 'The Altar Book Outreach Fund',
      amount: 75000,
      currency: 'NGN',
      paymentMethod: 'Direct Bank Transfer (Access Bank)',
      note: 'Supporting youth book distributions in Lagos.'
    });
    await donationsHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 201 || !result.data.success) {
      throw new Error('Failed to insert donation into Neon');
    }
    testReceiptCode = result.data.receiptCode;
    console.log(`\n   -> Recorded Seed Sown in Neon with Receipt: ${testReceiptCode}`);
  });

  await test('Donations Service - Pastor Audit Log (GET api/donations.js)', async () => {
    const { req, res } = createMockReqRes('GET');
    await donationsHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 200 || !result.data.donations) {
      throw new Error('Failed to retrieve donations from Neon');
    }
    const found = result.data.donations.find(d => d.receipt_code === testReceiptCode);
    if (!found) {
      throw new Error(`Donation ${testReceiptCode} not found in database`);
    }
    console.log(`\n   -> Verified donation ${testReceiptCode} persisted in Neon: ₦${found.amount}`);
  });

  // 7. Pastor Content Publishing - Post New Video Sermon
  await test('Pastor Content Publishing - New Video (POST api/content.js?type=videos)', async () => {
    const videoId = `sermon-vigil-${Date.now()}`;
    const { req, res } = createMockReqRes('POST', { type: 'videos' }, {
      id: videoId,
      title: 'Night of Holy Silence & Consecration',
      series: 'Special Vigils',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/images/video-prayer.jpg',
      duration: '1 hr 05 min',
      scripture: 'Psalm 62:1-5',
      description: 'Rev. Tresh leads the global congregation in an evening of sacred quietness and intercession.',
      speaker: 'Rev. Tresh'
    });
    await contentHandler(req, res);
    const result = res._getData();
    if (result.statusCode !== 201 || !result.data.success) {
      throw new Error('Failed to post video into Neon');
    }
    console.log(`\n   -> Pastor published video "${result.data.video.title}" into Neon.`);
  });

  console.log('\n====================================================');
  console.log(`RESULTS: ${passedTests}/${totalTests} End-to-End Service Tests Passed!`);
  console.log('====================================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runEndToEndTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
