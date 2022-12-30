import { connect } from 'amqplib';

const defaultUrl = 'amqp://guest:guest@rabbitmq:5672';

export async function getAmqpConnection(url: string = defaultUrl) {
  const connection = await connect(url);
  return connection;
}
