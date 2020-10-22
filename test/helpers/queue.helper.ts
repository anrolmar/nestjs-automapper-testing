import { CreateMessageDto } from '@dtos/create-message.dto';
export class QueueHelper {
  static getCreateMessageQueueDto(): CreateMessageDto {
    return {
      filePath: 'test.png',
      containerName: 'test-container',
      resultPath: 'result-test.png',
      language: 'fr-FR',
      pageNumber: 1
    };
  }
}
