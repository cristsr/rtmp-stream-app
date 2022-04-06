import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MEDIA_SERVER } from '../constants';
import NodeMediaServer from 'node-media-server';
import { extractKeyFromPath } from '../utils';
import { StreamMsRepository, StreamRepository } from '../repositories';
import { StreamReq } from '../dto';
import { plainToClass } from 'class-transformer';
import { ThumbnailService } from './thumbnail.service';

@Injectable()
export class StreamService implements OnModuleInit {
  private logger = new Logger(StreamService.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,
    private streamMsRepository: StreamMsRepository,
    private streamRepository: StreamRepository,
    private thumbnailService: ThumbnailService,
  ) {}

  onModuleInit() {
    this.nms.on('prePublish', this.connectStream.bind(this));

    this.nms.on('postPublish', (id, StreamPath, args) => {
      console.log(
        '[NodeEvent on postPublish]',
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
      );
    });
    this.nms.on('donePublish', this.disconnectStream.bind(this));
  }

  async connectStream(id: string, streamPath: string): Promise<void> {
    const key = extractKeyFromPath(streamPath);

    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return (this.nms.getSession(id) as any).reject();
    }

    this.thumbnailService.generate(key);

    const request = plainToClass(StreamReq, stream);

    this.logger.log(`Connect stream request`, request);

    this.streamMsRepository.connectStream(request).subscribe({
      next: () => {
        this.logger.log(`Stream with key ${key} connected`);
      },
      error: (err) => {
        this.logger.error(`Stream with key ${key} connection error`, err);
      },
    });
  }

  async disconnectStream(id: string, streamPath: string): Promise<void> {
    const key = extractKeyFromPath(streamPath);

    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return;
    }

    this.streamMsRepository.disconnectStream(stream.id).subscribe({
      next: () => {
        this.logger.log(`Stream with key ${key} disconnected`);
      },
      error: (err) => {
        this.logger.error(`Stream with key ${key} disconnection error`, err);
      },
    });
  }
}
