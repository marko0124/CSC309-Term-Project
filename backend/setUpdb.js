const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  console.log('Setting up database...');
  
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || '/data/sqlite/dev.db';
  console.log(`Database path: ${dbPath}`);
  
  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    console.log(`Creating directory: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Create empty database file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    console.log('Creating empty database file');
    fs.writeFileSync(dbPath, '');
  }
  
  // Run migrations directly
  console.log('Running migrations...');
  return new Promise((resolve, reject) => {
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error.message}`);
        console.error(stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}

module.exports = { setupDatabase };