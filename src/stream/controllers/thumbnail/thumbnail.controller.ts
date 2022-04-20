import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('thumbnail')
export class ThumbnailController {
  private logger = new Logger(ThumbnailController.name);

  @Get(':image')
  getImage(@Param('image') image: string, @Res() res: Response) {
    this.logger.log(`Getting thumbnail for image: ${image}`);
    const path = `${process.cwd()}/media/thumbnails/${image}`;

    res.sendFile(path, (err) => {
      if (err) {
        this.logger.error(`Error getting thumbnail for image: ${image}`);
        res.status(404).send();
      }
    });
  }
}
