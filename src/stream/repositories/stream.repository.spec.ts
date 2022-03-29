import { Test, TestingModule } from '@nestjs/testing';
import { StreamRepository } from './stream.repository';

describe('Stream', () => {
  let provider: StreamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamRepository],
    }).compile();

    provider = module.get<StreamRepository>(StreamRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
