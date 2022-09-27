import { Test, TestingModule } from '@nestjs/testing';
import { UsefulService } from './useful.service';

describe('UsefulService', () => {
  let service: UsefulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsefulService],
    }).compile();

    service = module.get<UsefulService>(UsefulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
