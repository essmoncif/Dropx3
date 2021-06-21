import { Test, TestingModule } from '@nestjs/testing';
import { HlbService } from './hlb.service';

describe('HlbService', () => {
  let service: HlbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HlbService],
    }).compile();

    service = module.get<HlbService>(HlbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
