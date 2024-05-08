import { Test, TestingModule } from '@nestjs/testing';
import { ClassDeskService } from './class_desk.service';

describe('ClassDeskService', () => {
  let service: ClassDeskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassDeskService],
    }).compile();

    service = module.get<ClassDeskService>(ClassDeskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
