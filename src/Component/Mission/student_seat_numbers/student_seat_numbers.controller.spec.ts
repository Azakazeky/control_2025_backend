import { Test, TestingModule } from '@nestjs/testing';
import { StudentSeatNumbersController } from './student_seat_numbers.controller';
import { StudentSeatNumbersService } from './student_seat_numbers.service';

describe('StudentSeatNumbersController', () => {
  let controller: StudentSeatNumbersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentSeatNumbersController],
      providers: [StudentSeatNumbersService],
    }).compile();

    controller = module.get<StudentSeatNumbersController>(StudentSeatNumbersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
