/* eslint-disable prettier/prettier */
import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

//to delete an entire database before each test
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

//to disconnect from the database after database has been deleted and until another test is done and the database in created
global.afterEach(async () => {
  const connection = getConnection();
  await connection.close();
});
