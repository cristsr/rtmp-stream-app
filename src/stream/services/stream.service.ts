import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MEDIA_SERVER } from '../constants';
import NodeMediaServer from 'node-media-server';
import { extractKeyFromPath } from '../utils';

@Injectable()
export class StreamService implements OnModuleInit {
  private logger = new Logger(StreamService.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,
  ) {}

  onModuleInit() {
    this.nms.on('prePublish', (id: string, streamPath: string) => {
      const streamKey = extractKeyFromPath(streamPath);
      this.logger.log(`onPrePublish: ${streamKey} ${id}`);
    });
  }
}
