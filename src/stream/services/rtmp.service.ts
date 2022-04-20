import { Injectable, Logger } from '@nestjs/common';
import { StreamProvider } from 'stream/providers';
import { StreamRepository } from 'stream/repositories';
import { ThumbnailService } from './thumbnail.service';

@Injectable()
export class RtmpService {
  private logger = new Logger(RtmpService.name);

  constructor(
    private streamRepository: StreamRepository,
    private streamProvider: StreamProvider,
    private thumbnailService: ThumbnailService,
  ) {}

  async connectStream(key: string, session: any): Promise<void> {
    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream ${key} not found`);
      return session.reject();
    }

    const thumbnail = await this.thumbnailService.generate(key);
    console.log(thumbnail);

    this.streamProvider.connectStream({ key, thumbnail }).subscribe({
      next: () => {
        this.logger.log(`Connect stream successfully`);
      },
      error: (err) => {
        this.logger.error(`Connect stream error: ${err.message}`);
      },
    });
  }

  async disconnectStream(key: string): Promise<void> {
    this.streamProvider.disconnectStream(key).subscribe({
      next: () => {
        this.logger.log(`Disconnect stream successfully`);
      },
      error: (err) => {
        this.logger.error(`Disconnect stream error: ${err}`);
      },
    });
  }
}
