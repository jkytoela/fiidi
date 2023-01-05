import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create categories table
  await db.schema
    .createTable('categories')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'text', (col) => col.unique().notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();

  // Create articles table
  await db.schema
    .createTable('articles')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('link', 'text', (col) => col.unique().notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();

  // Create articles_categories pivot table
  await db.schema
    .createTable('articles_categories')
    .addColumn('article_id', 'uuid', (col) => col.references('articles.id').onDelete('cascade'))
    .addColumn('category_id', 'uuid', (col) => col.references('categories.id').onDelete('cascade'))
    .execute();

  // Create index for article_id
  await db.schema
    .createIndex('category_id')
    .using('btree')
    .on('articles_categories')
    .column('category_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('articles_categories').execute();
  await db.schema.dropTable('articles').execute();
  await db.schema.dropTable('categories').execute();
}
