import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';
import { spawn } from 'child_process';

@Injectable()
export class ThumbnailService {
  constructor(private config: ConfigService) {}

  generate(key: string): void {
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

    setTimeout(() => {
      const ffmpeg = spawn(cmd, args);

      ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

      ffmpeg.unref();
    }, 2000);
  }
}
