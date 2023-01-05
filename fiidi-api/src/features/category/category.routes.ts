import express, { Request, Response } from 'express';
import type { Kysely } from 'kysely';
import type { Database } from '../../services/database';
import { getCategories } from './category.repository';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const db = req.app.get('db') as Kysely<Database>;
  getCategories(db)
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      console.log('Error while fetching categories', error);
      res.status(500).json({ msg: 'Internal server error' });
    });
});

export default router;