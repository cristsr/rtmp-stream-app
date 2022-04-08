import { Test, TestingModule } from '@nestjs/testing';
import { OnlineStreamRepository } from './online-stream.repository';

describe('OnlineStreamService', () => {
  let service: OnlineStreamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineStreamRepository],
    }).compile();

    service = module.get<OnlineStreamRepository>(OnlineStreamRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
