import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { ArticleTable, ArticlesCategories } from '../../features/article/article.table';
import { CategoryTable } from '../../features/category/category.table';
import { databaseUrl } from '../../config/config';

export interface Database {
  articles: ArticleTable
  categories: CategoryTable
  articles_categories: ArticlesCategories
}

export async function getDbConnection() {
  const connection = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: async () => new Pool({ connectionString: databaseUrl }),
    }),
  });

  return connection;
}
