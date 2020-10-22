import { Channel, Message } from 'amqplib';

import Axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'amqplib-plus';

export class PdfConsumer extends Consumer {
  constructor(conn, prepareFn, private readonly configService: ConfigService) {
    super(conn, prepareFn, false);
  }

  processMessage(message: Message, _channel: Channel): void {
    const consumerImportApi = this.configService.get(
      'integration.PDF_CONSUMER'
    );

    const queueMessage = JSON.parse(message.content.toString());
    const fileName = queueMessage.filePath.substring(
      queueMessage.filePath.lastIndexOf('/')
    );
    const blobMessage = {
      filePath: queueMessage.filePath,
      name: fileName,
      container: queueMessage.containerName
    };

    Axios.post(consumerImportApi, blobMessage);
  }
}
