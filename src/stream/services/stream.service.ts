import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MEDIA_SERVER } from '../constants';
import NodeMediaServer from 'node-media-server';
import { extractKeyFromPath } from '../utils';
import { StreamRepository } from '../repositories/stream.repository';

@Injectable()
export class StreamService implements OnModuleInit {
  private logger = new Logger(StreamService.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,

    private streamRepository: StreamRepository,
  ) {}

  onModuleInit() {
    this.nms.on('prePublish', (id: string, streamPath: string) => {
      const key = extractKeyFromPath(streamPath);
      this.streamRepository.addStream(key, id).subscribe(() => {
        this.logger.log(`Stream added: ${key} - ${id}`);
      });
    });

    this.nms.on('donePublish', (id: string, streamPath: string) => {
      const key = extractKeyFromPath(streamPath);
      this.streamRepository.removeStream(key, id).subscribe(() => {
        this.logger.log(`Stream removed: ${key} - ${id}`);
      });
    });
  }
}
