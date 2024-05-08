import { Test, TestingModule } from '@nestjs/testing';
import { ExamMissionController } from './exam_mission.controller';
import { ExamMissionService } from './exam_mission.service';

describe('ExamMissionController', () => {
  let controller: ExamMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamMissionController],
      providers: [ExamMissionService],
    }).compile();

    controller = module.get<ExamMissionController>(ExamMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
