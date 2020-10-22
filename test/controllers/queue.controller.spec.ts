import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { QueueController } from '@controllers/queue.controller';
import { QueueHelper } from './../helpers/queue.helper';
import { RabbitMQService } from '@services/rabbitmq.service';

jest.mock('@services/rabbitmq.service');
jest.mock('@nestjs/config');

let queueController: QueueController;
let rabbitMqService: RabbitMQService;
let configService: ConfigService;

describe('Queue controller', () => {
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [QueueController, RabbitMQService, ConfigService]
    }).compile();

    queueController = testingModule.get<QueueController>(QueueController);
    rabbitMqService = testingModule.get<RabbitMQService>(RabbitMQService);
    configService = testingModule.get<ConfigService>(ConfigService);
  });

  it('should be initialized', () => {
    expect(queueController).not.toBeNull();
    expect(rabbitMqService).not.toBeNull();
    expect(configService).not.toBeNull();
  });

  it('should create a new message', () => {
    // given
    const createMessageMock = QueueHelper.getCreateMessageQueueDto();

    const getConfigServiceSpy = jest.spyOn(configService, 'get');
    getConfigServiceSpy.mockReturnValueOnce('http://queue-svc/api');

    // when
    queueController.createMessage(createMessageMock);

    // then
    expect(rabbitMqService.createMessage).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if it has not being possible to create a new message', () => {
    // given
    jest.spyOn(rabbitMqService, 'createMessage').mockImplementation(() => {
      throw new Error('The message has not being possible to send');
    });

    // when
    // then
    expect(queueController.createMessage).toThrow();
  });
});
