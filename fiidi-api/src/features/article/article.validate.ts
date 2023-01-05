import * as z from 'zod';

export const articleMessage = z.object({
  link: z.string(),
  title: z.string(),
  categories: z.array(z.string())
    .nullable()
    .transform((c) => c === null ? [] : c.map((name) => name.toLocaleLowerCase())),
});

export const paginateQueryParams = (data: string) => z.preprocess(
  (a) => parseInt(a as string, 10),
  z.number().positive(),
).safeParse(data);