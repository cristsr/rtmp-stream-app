import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import NodeMediaServer from 'node-media-server';
import { plainToClass } from 'class-transformer';
import { MEDIA_SERVER } from '../constants';
import { extractKeyFromPath } from '../utils';
import { StreamMsRepository, StreamRepository } from '../repositories';
import { StreamReq } from '../dto';
import { ThumbnailService } from './thumbnail.service';

@Injectable()
export class StreamService implements OnModuleInit {
  private logger = new Logger(StreamService.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,

    private commandBus: CommandBus,

    private streamMsRepository: StreamMsRepository,
    private streamRepository: StreamRepository,
    private thumbnailService: ThumbnailService,
  ) {}

  onModuleInit() {
    this.nms.on('prePublish', this.connectStream.bind(this));
    this.nms.on('donePublish', this.disconnectStream.bind(this));
  }

  async connectStream(id: string, streamPath: string): Promise<void> {
    const key = extractKeyFromPath(streamPath);

    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return (this.nms.getSession(id) as any).reject();
    }

    const request = plainToClass(StreamReq, stream);

    request.thumbnail = 'stream/thumbnails/' + key.concat('.png');

    this.thumbnailService.generate(key);

    this.logger.log(`Connect stream request`, request);
  }

  async disconnectStream(id: string, streamPath: string): Promise<void> {
    const key = extractKeyFromPath(streamPath);

    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return;
    }
  }
}
