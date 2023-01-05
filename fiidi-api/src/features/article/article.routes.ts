import express, { Request, Response } from 'express';
import type { Kysely } from 'kysely';
import type { Database } from '../../services/database';
import { getPaginatedArticles } from './article.repository';
import { paginateQueryParams } from './article.validate';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const db = req.app.get('db') as Kysely<Database>;
  const page = paginateQueryParams(req.query.page as string);
  if (!page.success) {
    res.status(400).json({ msg: 'Invalid query params', error: page.error.format() });
    return;
  }

  getPaginatedArticles(db, page.data)
    .then((data) => res.status(200).json(data.rows))
    .catch((error) => {
      console.log('Error while fetching articles', error);
      res.status(500).json({ msg: 'Internal server error' });
    });
});

export default router;