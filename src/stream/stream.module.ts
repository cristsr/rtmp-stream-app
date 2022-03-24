import { Module } from '@nestjs/common';
import { StreamService } from './services/stream.service';
import { ConfigService } from '@nestjs/config';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER } from './constants';

@Module({
  providers: [
    {
      provide: MEDIA_SERVER,
      useFactory: (config: ConfigService) => {
        return new NodeMediaServer({
          logType: 3,

          rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60,
          },
          http: {
            port: 3000,
            allow_origin: '*',
            mediaroot: './media',
          },
          trans: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
              {
                app: 'live',
                hls: true,
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
  ],
})
export class StreamModule {}
