import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { ENV } from 'environment';
import { formatError } from 'stream/utils';
import { StreamReq } from 'stream/dto';

@Injectable()
export class StreamProvider {
  private readonly logger = new Logger(StreamProvider.name);
  private readonly streamUrl: string;

  constructor(private http: HttpService, private config: ConfigService) {
    this.streamUrl = this.config.get(ENV.STREAM_APP_URL);
  }

  connectStream(data: StreamReq): Observable<void> {
    const url = this.streamUrl.concat('/stream/connect');
    this.logger.log(`Adding stream to ${url}`);
    return this.http.post(url, data).pipe(formatError());
  }

  disconnectStream(key: string): Observable<void> {
    const url = this.streamUrl.concat('/stream/disconnect').concat(key);
    this.logger.log(`Removing stream from ${url}`);
    return this.http.delete(url).pipe(formatError());
  }
}
