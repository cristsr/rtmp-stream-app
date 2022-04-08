import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, mapTo, Observable, throwError } from 'rxjs';
import { ENV } from 'environment';
import { StreamReq } from '../../dto';

@Injectable()
export class StreamMsRepository {
  private readonly logger = new Logger(StreamMsRepository.name);
  private readonly streamUrl: string;

  constructor(private http: HttpService, private config: ConfigService) {
    this.streamUrl = this.config.get(ENV.STREAM_APP_URL);
  }

  connectStream(stream: StreamReq): Observable<void> {
    const url = this.streamUrl + '/stream/connect';

    this.logger.log(`Adding stream to ${url}`);

    return this.http.post(url, stream).pipe(
      mapTo(null),
      catchError((e) => throwError(e.response.data)),
    );
  }

  disconnectStream(streamId: string): Observable<void> {
    const url =
      this.config.get(ENV.STREAM_APP_URL) + '/stream/disconnect/' + streamId;

    this.logger.log(`Removing stream from ${url}`);

    return this.http.delete(url).pipe(
      mapTo(null),
      catchError((e) => throwError(e.response.data)),
    );
  }
}
