import { Test, TestingModule } from '@nestjs/testing';
import { RtmpController } from './rtmp.controller';

describe('RtmpController', () => {
  let controller: RtmpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RtmpController],
    }).compile();

    controller = module.get<RtmpController>(RtmpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
