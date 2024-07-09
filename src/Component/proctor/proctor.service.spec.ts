import { Test, TestingModule } from '@nestjs/testing';
import { ProctorService } from './proctor.service';

describe('ProctorService', () => {
  let service: ProctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProctorService],
    }).compile();

    service = module.get<ProctorService>(ProctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
