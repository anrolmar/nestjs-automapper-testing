import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  DEFAULT_QUEUE: process.env.RABBITMQ_DEFAULT_QUEUE,
  HEARTBEAT: process.env.RABBITMQ_HEARTBEAT,
  HOST: process.env.RABBITMQ_HOST,
  PORT: process.env.RABBITMQ_PORT,
  USER: process.env.RABBITMQ_USER,
  PASS: process.env.RABBITMQ_PASS,
  VHOST: process.env.RABBITMQ_VHOST
}));
