const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const {
  DATABASE_HOST = 'localhost',
  DATABASE_PORT = '27017',
  DATABASE_NAME = 'cloak-service',
  DATABASE_USERNAME = '',
  DATABASE_PASSWORD = '',
} = process.env;

let connectionString = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
if (DATABASE_USERNAME && DATABASE_PASSWORD) {
  connectionString = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
}

function runMigrations() {
  const currentDb = db.getSiblingDB(DATABASE_NAME);
  
  if (!currentDb.getCollectionNames().includes('migrations')) {
    currentDb.createCollection('migrations');
    print('Created migrations collection');
  }
  
  const appliedMigrations = currentDb.migrations.find({}, { name: 1 }).toArray().map(m => m.name);
  print(`Found ${appliedMigrations.length} applied migrations`);
  
  const scriptsDir = __dirname + '/scripts';
  const migrationFiles = fs.readdirSync(scriptsDir)
    .filter(file => file.endsWith('.js'))
    .sort();
  
  print(`Found ${migrationFiles.length} migration files`);
  
  for (const file of migrationFiles) {
    if (!appliedMigrations.includes(file)) {
      print(`Applying migration: ${file}`);
      
      try {
        load(scriptsDir + '/' + file);
        
        currentDb.migrations.insertOne({
          name: file,
          appliedAt: new Date()
        });
        
        print(`Successfully applied migration: ${file}`);
      } catch (error) {
        print(`Error applying migration ${file}: ${error.message}`);
        quit(1);
      }
    } else {
      print(`Skipping already applied migration: ${file}`);
    }
  }
  
  print('All migrations applied successfully');
}

runMigrations(); 