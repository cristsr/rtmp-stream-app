import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { filter, take } from 'rxjs';
import { watch } from 'stream/utils';

@Injectable()
export class ThumbnailService {
  constructor(private config: ConfigService) {
    this.generate('362b4a42cb1fd7995e7a');
  }

  generate(key: string): void {
    const dir = './media/live/{key}'.replace('{key}', key);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const source = watch(dir, {}).pipe(
      filter(({ filename }) => filename === 'index.m3u8'),
      take(1),
    );

    source.subscribe({
      next: () => {
        this.spawn(key);
      },
      error: (err) => {
        console.log('reader file');
        console.log(err);
      },
    });
  }

  private spawn(key: string) {
    const cmd = this.config.get(ENV.FFMPEG);
    const args = [
      '-y',
      '-i',
      `media/live/${key}/index.m3u8`,
      '-ss',
      '00:00:01',
      '-vframes',
      '1',
      '-vf',
      'scale=-2:300',
      `thumbnails/${key}.png`,
    ];

    const ffmpeg = spawn(cmd, args);

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.unref();
  }
}
