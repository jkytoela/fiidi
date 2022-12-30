import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { getDbConnection } from './services/database';
import { getAmqpConnection } from './services/rabbitmq';
import { consumeArticles } from './features/article/article.amqp';
import * as middlewares from './middlewares';
import articleRoutes from './features/article/article.routes';
import categoryRoutes from './features/category/category.routes';

require('dotenv').config();

const port = process.env.PORT || 8080;

async function startApp() {
  const app = express();
  const db = await getDbConnection();
  const amqpConnection = await getAmqpConnection();

  app.set('db', db);

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/articles', articleRoutes);
  app.use('/api/v1/categories', categoryRoutes);

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
    consumeArticles(amqpConnection);
  });
}

export default startApp;
