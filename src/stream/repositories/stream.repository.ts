import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, EMPTY, mapTo, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';

@Injectable()
export class StreamRepository {
  private logger = new Logger(StreamRepository.name);

  constructor(private http: HttpService, private config: ConfigService) {}

  addStream(key: string, id: string): Observable<boolean> {
    const url = this.config.get(ENV.STREAM_APP_URL) + '/stream/add';

    this.logger.log(`Adding stream to ${url}`);

    const data = {
      key,
      id,
    };

    return this.http.post(url, data).pipe(
      mapTo(true),
      catchError((e) => {
        this.logger.error(e.message);
        return EMPTY;
      }),
    );
  }

  removeStream(key: string, id: string): Observable<boolean> {
    const url = this.config.get(ENV.STREAM_APP_URL) + '/stream/remove';

    this.logger.log(`Removing stream from ${url}`);

    const data = {
      key,
      id,
    };

    return this.http.post(url, data).pipe(
      mapTo(true),
      catchError((e) => {
        this.logger.error(e.message);
        return EMPTY;
      }),
    );
  }
}
