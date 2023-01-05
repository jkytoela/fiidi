import { connect } from 'amqplib';
import { amqpUrl } from '../../config/config';

export async function getAmqpConnection() {
  const connection = await connect(amqpUrl);
  return connection;
}
