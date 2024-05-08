import { Test, TestingModule } from '@nestjs/testing';
import { ExamRoomsController } from './exam_rooms.controller';
import { ExamRoomsService } from './exam_rooms.service';

describe('ExamRoomsController', () => {
  let controller: ExamRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamRoomsController],
      providers: [ExamRoomsService],
    }).compile();

    controller = module.get<ExamRoomsController>(ExamRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
