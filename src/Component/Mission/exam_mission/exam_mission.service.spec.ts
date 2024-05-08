import { Test, TestingModule } from '@nestjs/testing';
import { ExamMissionService } from './exam_mission.service';

describe('ExamMissionService', () => {
  let service: ExamMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamMissionService],
    }).compile();

    service = module.get<ExamMissionService>(ExamMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
