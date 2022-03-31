import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MEDIA_SERVER } from '../constants';
import NodeMediaServer from 'node-media-server';
import { extractKeyFromPath } from '../utils';
import { StreamMsRepository, StreamRepository } from '../repositories';

@Injectable()
export class StreamService implements OnModuleInit {
  private logger = new Logger(StreamService.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,

    private streamMsRepository: StreamMsRepository,
    private streamRepository: StreamRepository,
  ) {}

  onModuleInit() {
    this.nms.on('prePublish', async (id: string, streamPath: string) => {
      const key = extractKeyFromPath(streamPath);

      const stream = await this.streamRepository.findByKey(key);

      if (!stream) {
        this.logger.error(`Stream with key ${key} not found`);
        return await (this.nms.getSession(id) as any).reject();
      }

      this.logger.log(`Stream with key ${key} found`, stream);

      await this.streamMsRepository.addStream(stream);

      this.logger.log(`Stream added: ${key} - ${id}`);
    });

    this.nms.on('donePublish', async (id: string, streamPath: string) => {
      const key = extractKeyFromPath(streamPath);

      const stream = await this.streamRepository.findByKey(key);

      if (!stream) {
        this.logger.error(`Stream with key ${key} not found`);
        return;
      }

      await this.streamMsRepository.removeStream(stream.id);
      this.logger.log(`Stream removed: ${key} - ${id}`);
    });
  }
}
