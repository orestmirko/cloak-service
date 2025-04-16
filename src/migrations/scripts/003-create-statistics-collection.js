const db = db.getSiblingDB(db.getName());

print('Starting migration: Creating statistics collection...');

if (!db.getCollectionNames().includes('statistics')) {
  print('Creating statistics collection...');
  db.createCollection('statistics');
  
  db.statistics.createIndex({ date: 1 }, { background: true });
  db.statistics.createIndex({ type: 1 }, { background: true });
  db.statistics.createIndex({ date: 1, type: 1 }, { unique: true });
  
  db.statistics.insertOne({
    type: 'bot_detection',
    date: new Date(),
    counts: {
      total: 0,
      bots: 0,
      humans: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Statistics collection created successfully!');
} else {
  print('Statistics collection already exists, skipping...');
}

print('Migration completed successfully!'); 