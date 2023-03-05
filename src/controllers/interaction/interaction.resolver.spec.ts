import { Test, TestingModule } from '@nestjs/testing';
import { InteractionResolver } from './interaction.resolver';

describe('InteractionResolver', () => {
  let resolver: InteractionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionResolver],
    }).compile();

    resolver = module.get<InteractionResolver>(InteractionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
