import { Test, TestingModule } from '@nestjs/testing';
import { StreamProvider } from 'stream/providers';

describe('Stream', () => {
  let provider: StreamProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamProvider],
    }).compile();

    provider = module.get<StreamProvider>(StreamProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
