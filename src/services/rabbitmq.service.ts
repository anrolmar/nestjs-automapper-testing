import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel } from 'amqplib';
import { Connection, Publisher } from 'amqplib-plus';
import { Queue } from './../models/queue.model';
import { PdfConsumer } from './consumers/pdf-consumer';
import { QueueService } from './queue.interface';

@Injectable()
export class RabbitMQService implements QueueService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Logger) private readonly logger: LoggerService
  ) {}

  async createMessage(name: string, data: Queue): Promise<void> {
    console.log(`Creating the message into the queue ${name}`);

    const connection = this.getConnection();
    await connection.connect();
    this.logger.log('Connected to RabbitMQ');

    const preparePublisher = async (channel: Channel) => {
      await channel.assertQueue(name, {});
      this.logger.log('Publisher ready');
    };
    const publisher = new Publisher(connection, preparePublisher);
    await publisher.sendToQueue(name, Buffer.from(JSON.stringify(data)), {});

    this.logger.log(`Message sent to the queue ${name}`);
  }

  async runConsumer(name: string) {
    const connection = this.getConnection();
    await connection.connect();
    this.logger.log('Connected to RabbitMQ');

    const prepareConsumer = async (channel: Channel) => {
      await channel.assertQueue(name, {});
      this.logger.log('Consumer ready');
    };

    const customConsumer = new PdfConsumer(
      connection,
      prepareConsumer,
      this.configService
    );
    await customConsumer.consume(name, {});
  }

  private getConnection(): Connection {
    return new Connection({
      host: this.configService.get('rabbitmq.HOST'),
      port: this.configService.get('rabbitmq.PORT'),
      user: this.configService.get('rabbitmq.USER'),
      pass: this.configService.get('rabbitmq.PASS')
    });
  }
}
