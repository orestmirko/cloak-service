const db = db.getSiblingDB(db.getName());

print('Starting migration: Updating RequestLog schema...');

print('Adding new fields to RequestLog documents...');

db.requestLogs.updateMany(
  { country: { $exists: false } },
  { $set: { country: 'unknown' } }
);

db.requestLogs.updateMany(
  { processingTime: { $exists: false } },
  { $set: { processingTime: 0 } }
);

db.requestLogs.createIndex({ country: 1 }, { background: true });

print('RequestLog schema updated successfully!');
print('Migration completed successfully!'); 