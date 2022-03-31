import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, EMPTY, firstValueFrom, lastValueFrom, mapTo } from 'rxjs';
import { ENV } from 'environment';

@Injectable()
export class StreamMsRepository {
  private logger = new Logger(StreamMsRepository.name);

  constructor(private http: HttpService, private config: ConfigService) {}

  addStream(stream): Promise<any> {
    const url = this.config.get(ENV.STREAM_APP_URL) + '/stream/add';

    this.logger.log(`Adding stream to ${url}`);

    const source = this.http.post(url, stream).pipe();

    return lastValueFrom(source).catch((e) => {
      this.logger.error(e.response.data);
      return false;
    });
  }

  removeStream(key: string): Promise<boolean> {
    const url = this.config.get(ENV.STREAM_APP_URL) + '/stream/remove/' + key;

    this.logger.log(`Removing stream from ${url}`);

    const source = this.http.delete(url).pipe(
      mapTo(true),
      catchError((e) => {
        this.logger.error(e.message);
        return EMPTY;
      }),
    );

    return firstValueFrom(source);
  }
}
