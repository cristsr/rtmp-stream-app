import { Test, TestingModule } from '@nestjs/testing';
import { StreamMsRepository } from '../stream-ms/stream-ms.repository';

describe('Stream', () => {
  let provider: StreamMsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamMsRepository],
    }).compile();

    provider = module.get<StreamMsRepository>(StreamMsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
