import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('thumbnail')
export class ThumbnailController {
  private logger = new Logger(ThumbnailController.name);

  @Get(':image')
  getImage(@Query('image') image: string, @Res() res: Response) {
    this.logger.log(`Getting thumbnail for image: ${image}`);
    const path = `${process.cwd()}/media/thumbnails/${image}`;
    res.sendFile(path);
  }
}
