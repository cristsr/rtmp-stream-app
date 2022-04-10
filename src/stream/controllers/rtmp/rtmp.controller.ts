import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { MEDIA_SERVER } from 'stream/constants';
import { RtmpService, ThumbnailService } from 'stream/services';
import { extractKeyFromPath } from 'stream/utils';

@Injectable()
export class RtmpController implements OnModuleInit {
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

  async connectStream(id: string, streamPath: string, args: any) {
    console.log('connectStream', id, streamPath, args);
    const key = extractKeyFromPath(streamPath);
    const session = this.nms.getSession(id);
    this.thumbnailService.generate(key);
    await this.rtmpService.connectStream(key, session);
  }

  async disconnectStream(id: string, streamPath: string, args: any) {
    const key = extractKeyFromPath(streamPath);
    await this.rtmpService.disconnectStream(key);

    console.log('disconnectStream', id, streamPath, args);
  }
}
