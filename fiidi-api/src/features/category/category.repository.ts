import type { Kysely } from 'kysely';
import type { Database } from '../../services/database';

export async function getCategories(db: Kysely<Database>) {
  return db.selectFrom('categories').selectAll().execute();
}
