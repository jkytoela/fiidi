import type { Connection } from 'amqplib';

export async function consumeArticles(connection: Connection) {
  try {
    const channel = await connection.createChannel();
  
    const queue = 'articles';
    await channel.assertQueue(queue);
  
    console.log('Waiting for messages in %s.', queue);
    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log(message.content.toString());
        channel.ack(message);
      }
      // const article = JSON.parse(data as string) as Article; // TODO: Validate data
    });
  } catch (error) {
    console.log(`Error consuming articles: ${error}`);
  }
}
  