import { Controller, Get } from '@nestjs/common';

@Controller('stream')
export class StreamController {
  @Get('streams')
  getStreams() {
    return 'streams';
  }
}
