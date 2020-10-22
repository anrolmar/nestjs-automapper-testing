import applicationConf from '@configurations/application.conf';
import integrationConf from '@configurations/integration.conf';
import rabbitmqConf from '@configurations/rabbitmq.conf';
import { QueueController } from '@controllers/queue.controller';
import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from '@services/rabbitmq.service';
import { AutomapperModule } from 'nestjsx-automapper';
import './mappers/queue.profile';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [applicationConf, rabbitmqConf, integrationConf],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().default('prod'),
        APP_NAME: Joi.string().default('Queue Service')
      })
    }),
    AutomapperModule.withMapper()
  ],
  controllers: [QueueController],
  providers: [Logger, RabbitMQService]
})
export class AppModule {}
