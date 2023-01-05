import { sql } from 'kysely';
import { articleMessage } from './article.validate';
import * as z from 'zod';
import type { Kysely } from 'kysely';
import type { Database } from '../../services/database';

type PaginatedArticles = {
  rows: {
    articles: {
      id: string;
      title: string;
      link: string;
      categories: Array<{
        id: string;
        name: string;
        created_at: string;
      }>
    }
  }
};

export async function getPaginatedArticles(
  db: Kysely<Database>,
  page: number,
  pageSize: number = 20,
) {
  // TODO: Use Kysely instead of raw SQL
  const offset = (page - 1) * pageSize;
  return sql<PaginatedArticles>`
    SELECT a.id, a.title, a.link, json_agg(c) as categories
    FROM articles a
    JOIN articles_categories ac ON a.id = ac.article_id
    JOIN categories c ON ac.category_id = c.id
    GROUP BY a.id, a.title, a.link
    LIMIT ${pageSize} OFFSET ${offset}
  `.execute(db);
}

export async function insertArticleMessage(
  db: Kysely<Database>,
  message: z.infer<typeof articleMessage>,
) {
  const { categories, ...msgArticle } = message;
  await db.transaction()
    .setIsolationLevel('serializable')
    .execute(async (trx) => {
      const article = await trx
        .insertInto('articles')
        .values(msgArticle)
        .onConflict((oc) => oc.column('link').doNothing())
        .returning('id')
        .executeTakeFirstOrThrow();

      if (!categories.length) {
        return;
      }

      const insertedCategories = await trx
        .insertInto('categories')
        .values(categories.map((name) => ({ name })))
        .onConflict((oc) => oc
          .column('name')
          .doUpdateSet({ name: (eb) => eb.ref('excluded.name') }),
        )
        .returning('id')
        .execute();

      const articlesCategories = insertedCategories.map((cat) => ({
        article_id: article.id,
        category_id: cat.id,
      }));
  
      await trx
        .insertInto('articles_categories')
        .values(articlesCategories)
        .execute();
    });
}
