import { articleMessage } from './article.validate';
import { insertArticleMessage } from './article.repository';
import type { Kysely } from 'kysely';
import type { Database } from '../../services/database';
import type { Connection, ConsumeMessage, Channel } from 'amqplib';
import * as z from 'zod';

type HandleMessageArgs = {
  message: ConsumeMessage;
  db: Kysely<Database>;
  channel: Channel;
};

/**
 * Handle a single message from the articles queue
 */
function handleMessage({ message, db, channel }: HandleMessageArgs) {
  let articleMsg: z.infer<typeof articleMessage> | undefined;
  try {
    const data = JSON.parse(message.content.toString());
    articleMsg = articleMessage.parse(data);
  } catch (error) {
    console.log('Could not parse message content');
    return;
  }

  insertArticleMessage(db, articleMsg)
    .then(() => console.log('Inserted new article'))
    .catch(() => console.log('Could not insert new article')) // Most likely the article exists already
    .finally(() => channel.ack(message)); // Acknowledge the message in any case, we don't want to reprocess it
}

/**
 * Consume AMQP messages from the articles queue and insert them to the database
 */
export async function consumeArticles(amqpConnection: Connection, db: Kysely<Database>) {
  const channel = await amqpConnection.createChannel();
  const queue = 'articles';
  await channel.assertQueue(queue);
  await channel.prefetch(1);
  
  console.log('Waiting for messages in %s.', queue);
  channel.consume(queue, (message) => {
    if (message !== null) {
      handleMessage({ message, db, channel });
    }
  });
} 
