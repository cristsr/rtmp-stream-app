import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database';
import { AppController } from './app.controller';
import { validate } from 'environment';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
