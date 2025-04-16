const db = db.getSiblingDB(db.getName());

print('Starting migration: Creating indexes and configuration collection...');

print('Creating indexes for RequestLog collection...');
db.requestLogs.createIndex({ ip: 1 }, { background: true });
db.requestLogs.createIndex({ createdAt: 1 }, { background: true });
db.requestLogs.createIndex({ ip: 1, createdAt: 1 }, { background: true });
db.requestLogs.createIndex({ result: 1 }, { background: true });
db.requestLogs.createIndex({ userAgent: 1 }, { background: true });

print('Creating configuration collection...');
if (!db.getCollectionNames().includes('configurations')) {
  db.createCollection('configurations');
}

print('Adding default configuration...');
db.configurations.updateOne(
  { key: 'botDetection' },
  {
    $set: {
      key: 'botDetection',
      settings: {
        maxRequestsPerMinute: 30,
        enableIpFiltering: true,
        enableUserAgentFiltering: true,
        enableReferrerFiltering: true,
        enableFrequencyFiltering: true,
        botPatterns: [
          'bot',
          'crawler',
          'spider',
          'googlebot',
          'bingbot',
          'yandex',
          'baidu',
          'curl',
          'wget',
          'postman',
          'insomnia',
          'python-requests',
          'axios',
          'node-fetch',
          'java'
        ],
        suspiciousReferrers: [
          'facebook.com/ads',
          'google.com/ads',
          'adwords.google',
          'adsmanager',
          'moderator',
          'review',
          'admin'
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  { upsert: true }
);

print('Creating ipInfo collection...');
if (!db.getCollectionNames().includes('ipInfo')) {
  db.createCollection('ipInfo');
  
  db.ipInfo.createIndex({ ip: 1 }, { unique: true });
  db.ipInfo.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 }); 
}

print('Migration completed successfully!'); 