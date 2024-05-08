import { Test, TestingModule } from '@nestjs/testing';
import { ExamRoomsService } from './exam_rooms.service';

describe('ExamRoomsService', () => {
  let service: ExamRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamRoomsService],
    }).compile();

    service = module.get<ExamRoomsService>(ExamRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
