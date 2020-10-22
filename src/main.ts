import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RabbitMQService } from '@services/rabbitmq.service';
import compression from 'compression';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Configure middleware
  app.use(compression());
  app.use(helmet());
  app.enableCors();

  // Add validators
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Configure logger
  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: './logs/queue-service.error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: './logs/queue-service.log'
        }),
        new winston.transports.Console()
      ]
    })
  );

  // Configure swagger
  const options = new DocumentBuilder()
    .setTitle('Queue Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  console.log(`${configService.get('application.NAME')} is running...`);
  await app.listen(configService.get('application.PORT'));

  // Initialize tasks
  const rabbitService = app.get(RabbitMQService);
  rabbitService.runConsumer(configService.get('rabbitmq.DEFAULT_QUEUE'));
}

bootstrap();
