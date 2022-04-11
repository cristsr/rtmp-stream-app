import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { ENV } from 'environment';
import { formatError } from 'stream/utils';

@Injectable()
export class StreamProvider {
  private readonly logger = new Logger(StreamProvider.name);
  private readonly streamUrl: string;

  constructor(private http: HttpService, private config: ConfigService) {
    this.streamUrl = this.config.get(ENV.STREAM_APP_URL);
  }

  connectStream(key: string): Observable<void> {
    const url = this.streamUrl.concat('/stream/connect/').concat(key);
    this.logger.log(`Adding stream to ${url}`);
    return this.http.get(url).pipe(formatError());
  }

  disconnectStream(key: string): Observable<void> {
    const url = this.streamUrl.concat('/stream/disconnect/').concat(key);
    this.logger.log(`Removing stream from ${url}`);
    return this.http.delete(url).pipe(formatError());
  }
}
