import { Test, TestingModule } from '@nestjs/testing';
import { RtmpService } from './rtmp.service';

describe('StreamService', () => {
  let service: RtmpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RtmpService],
    }).compile();

    service = module.get<RtmpService>(RtmpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
