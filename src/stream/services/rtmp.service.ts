import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { StreamProvider } from 'stream/providers';
import { StreamRepository } from 'stream/repositories';
import { StreamReq } from 'stream/dto';

@Injectable()
export class RtmpService {
  private logger = new Logger(RtmpService.name);

  constructor(
    private streamRepository: StreamRepository,
    private streamProvider: StreamProvider,
  ) {}

  async connectStream(key: string, session: any): Promise<void> {
    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return session.reject();
    }

    const request = plainToClass(StreamReq, stream);

    this.logger.log(`Connect stream request: `);
    this.logger.log(request);

    this.streamProvider.connectStream(request).subscribe({
      next: () => {
        this.logger.log(`Connect stream successfully`);
      },
      error: (err) => {
        this.logger.error(`Connect stream error: ${err}`);
      },
    });
  }

  async disconnectStream(key: string): Promise<void> {
    const stream = await this.streamRepository.findByKey(key);

    if (!stream) {
      this.logger.error(`Stream with key ${key} not found`);
      return;
    }

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
