import { Generated, Insertable, Selectable } from 'kysely';

export interface CategoryTable {
  id: Generated<string>
  name: string
  created_at: Generated<Date>
}

export type CategoryRow = Selectable<CategoryTable>;
export type InsertableCategoryRow = Insertable<CategoryTable>;
