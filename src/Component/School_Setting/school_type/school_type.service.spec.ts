import { Test, TestingModule } from '@nestjs/testing';
import { SchoolTypeService } from './school_type.service';

describe('SchoolTypeService', () => {
  let service: SchoolTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolTypeService],
    }).compile();

    service = module.get<SchoolTypeService>(SchoolTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
