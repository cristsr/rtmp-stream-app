import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER } from './stream/constants';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const mediaServer: NodeMediaServer = app.get(MEDIA_SERVER);

  mediaServer.run();

  await app.init();

  Logger.log(`App is running`, 'Bootstrap');
}
bootstrap();
