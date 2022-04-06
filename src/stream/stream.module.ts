import { Module } from '@nestjs/common';
import { StreamService } from './services/stream.service';
import { ConfigService } from '@nestjs/config';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER, MONGO_CLIENT } from './constants';
import { ENV } from 'environment';
import { HttpModule } from '@nestjs/axios';
import { StreamRepository, StreamMsRepository } from './repositories';
import { MongoClient } from 'mongodb';
import { ThumbnailService } from './services/thumbnail.service';

@Module({
  imports: [HttpModule],
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
            ffmpeg: config.get(ENV.FFMPEG),
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
    {
      provide: MONGO_CLIENT,
      useFactory: (config: ConfigService) => {
        return new MongoClient(config.get(ENV.DB_URI));
      },
      inject: [ConfigService],
    },
    StreamService,
    StreamRepository,
    StreamMsRepository,
    ThumbnailService,
  ],
})
export class StreamModule {}
