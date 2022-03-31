import { Module } from '@nestjs/common';
import { StreamService } from './services/stream.service';
import { ConfigService } from '@nestjs/config';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER } from './constants';
import { ENV } from 'environment';
import { HttpModule } from '@nestjs/axios';
import { StreamRepository, StreamMsRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Stream, StreamSchema } from './schemas/stream.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Stream.name,
        schema: StreamSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: MEDIA_SERVER,
      useFactory: (config: ConfigService) => {
        return new NodeMediaServer({
          logType: config.get(ENV.MEDIA_SERVER_LOG_LEVEL),
          rtmp: {
            port: config.get(ENV.RTMP_PORT),
            chunk_size: config.get(ENV.RTMP_CHUNK_SIZE),
            gop_cache: true,
            ping: 30,
            ping_timeout: 60,
          },
          http: {
            port: config.get(ENV.HTTP_PORT),
            allow_origin: '*',
            mediaroot: './media',
          },
          trans: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
              {
                app: 'live',
                hls: config.get(ENV.ENABLE_HLS),
                hlsFlags:
                  '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
              },
            ],
          },
        });
      },
      inject: [ConfigService],
    },
    StreamService,
    StreamRepository,
    StreamMsRepository,
  ],
})
export class StreamModule {}
