import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeAll(async () => {
  // Clean up test database before running e2e tests
  const dbPath = join(__dirname, '../test.sqlite');
  try {
    await rm(dbPath);
  } catch (err) {
    // File might not exist, which is fine
  }
});
