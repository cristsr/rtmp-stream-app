import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER } from 'stream/constants';
import { RtmpService, ThumbnailService } from 'stream/services';
import { extractKeyFromPath } from 'stream/utils';

@Injectable()
export class RtmpController implements OnModuleInit {
  private logger = new Logger(RtmpController.name);

  constructor(
    @Inject(MEDIA_SERVER)
    private nms: NodeMediaServer,
    private rtmpService: RtmpService,
    private thumbnailService: ThumbnailService,
  ) {}

  // media events handlers
  onModuleInit() {
    this.nms.on('prePublish', this.connectStream.bind(this));
    this.nms.on('donePublish', this.disconnectStream.bind(this));
  }

  async connectStream(id: string, streamPath: string) {
    this.logger.log(`Connect stream: ${id} ${streamPath}`);
    const key = extractKeyFromPath(streamPath);
    const session = this.nms.getSession(id);
    await this.thumbnailService.generate(key);
    await this.rtmpService.connectStream(key, session);
  }

  async disconnectStream(id: string, streamPath: string) {
    this.logger.log(`Disconnect stream: ${id} ${streamPath}`);
    const key = extractKeyFromPath(streamPath);
    await this.rtmpService.disconnectStream(key);
  }
}
