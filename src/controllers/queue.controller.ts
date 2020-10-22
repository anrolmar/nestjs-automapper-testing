import { BaseController } from '@decorators/base-controller.decorator';
import { CreateMessageDto } from '@dtos/create-message.dto';
import { Queue } from '@models/queue.model';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RabbitMQService } from '@services/rabbitmq.service';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';

@Controller('/api/queues')
@BaseController()
@ApiTags('queues')
export class QueueController {
  constructor(
    private readonly rabbitMqService: RabbitMQService,
    private readonly configService: ConfigService,
    @InjectMapper() private readonly mapper: AutoMapper
  ) {}

  @ApiOperation({ summary: 'Creates a new message into a queue' })
  @ApiResponse({
    status: 500,
    description: 'The message has being not possible to create.'
  })
  @ApiResponse({
    status: 201,
    description: 'The message has being created successfully.'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMessage(@Body() message: CreateMessageDto): void {
    try {
      const queue = this.mapper.map(message, Queue, CreateMessageDto);
      this.rabbitMqService.createMessage(
        this.configService.get('rabbitmq.DEFAULT_QUEUE'),
        queue
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
