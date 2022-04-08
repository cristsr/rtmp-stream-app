import { Injectable } from '@nestjs/common';
import { StreamReq } from '../../dto';

@Injectable()
export class OnlineStreamRepository {
  private readonly streams: Map<string, StreamReq> = new Map();

  reset(): void {
    this.streams.clear();
  }

  add(stream: StreamReq): void {
    this.streams.set(stream.id, stream);
  }

  getAll(): StreamReq[] {
    return Array.from(this.streams.values());
  }
}
