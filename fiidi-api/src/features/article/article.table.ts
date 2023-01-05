import { Generated, Insertable, Selectable } from 'kysely';

export interface ArticleTable {
  id: Generated<string>
  link: string
  title: string
  created_at: Generated<Date>
}

// TODO: Figure out a better location for pivot tables
export interface ArticlesCategories {
  article_id: Generated<string>
  category_id: Generated<string>
}

export type ArticleRow = Selectable<ArticleTable>;
export type InsertableArticleRow = Insertable<ArticleTable>;
