import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runMigrations(): Promise<void> {
  const logger = new Logger('Migrations');
  
  try {
    logger.log('Running database migrations...');
    const { stdout, stderr } = await execAsync('npm run migration:run');
    
    if (stderr) {
      logger.error(`Migration stderr: ${stderr}`);
    }
    
    logger.log(`Migrations completed: ${stdout}`);
  } catch (error) {
    logger.error(`Failed to run migrations: ${error.message}`);
    throw error;
  }
} 