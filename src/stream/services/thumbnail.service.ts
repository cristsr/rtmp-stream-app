import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';
import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, watch } from 'fs';

@Injectable()
export class ThumbnailService {
  private logger = new Logger(ThumbnailService.name);

  constructor(private config: ConfigService) {}

  async generate(key: string): Promise<string> {
    this.logger.log(`Thumbnail service started for ${key}`);

    const dir = './media/live/' + key;

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    try {
      await this.watch(dir);

      await this.generateThumbnail(key);

      this.logger.log(`File for ${key} was found`);

      const buffer = readFileSync(`media/thumbnails/${key}.png`);

      this.logger.log(`Thumbnail service finished for ${key}`);

      return Buffer.from(buffer).toString('base64') ?? '';
    } catch (error) {
      this.logger.error(error);
    }
  }

  private watch(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const watcher = watch(path, (event, filename) => {
        if (filename === 'index.m3u8') {
          watcher.close();
          resolve();
        }
      });

      watcher.once('error', () => {
        reject(new Error(`Error watching ${path}`));
      });

      setTimeout(() => {
        watcher.close();
        reject(new Error(`Timeout watching ${path}`));
      }, 5000);
    });
  }

  private generateThumbnail(key: string): Promise<void> {
    return new Promise((resolve) => {
      const source = `media/live/${key}/index.m3u8`;
      const destination = `media/thumbnails/${key}.png`;

      const cmd = this.config.get(ENV.FFMPEG);
      const args = [
        '-y',
        '-i',
        source,
        '-ss',
        '00:00:01',
        '-vframes',
        '1',
        '-vf',
        'scale=-2:300',
        destination,
      ];

      this.logger.log(`Create thumbnail for ${key}`);

      const ffmpeg = spawn(cmd, args, {
        detached: true,
        stdio: 'ignore',
      });

      ffmpeg.unref();

      ffmpeg.once('exit', () => {
        this.logger.log(`Generation thumbnail process for ${key} finished`);
        resolve();
      });
    });
  }
}
