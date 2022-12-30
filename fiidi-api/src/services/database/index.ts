import { createPool } from 'slonik';

const defaultConnectionUri = 'postgres://postgres:postgres@fiididb:5433/fiididb';

export async function getDbConnection(url: string = defaultConnectionUri) {
  const pool = await createPool(url);
  return pool;
}
