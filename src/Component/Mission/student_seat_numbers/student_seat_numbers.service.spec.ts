import { Test, TestingModule } from '@nestjs/testing';
import { StudentSeatNumbersService } from './student_seat_numbers.service';

describe('StudentSeatNumbersService', () => {
  let service: StudentSeatNumbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentSeatNumbersService],
    }).compile();

    service = module.get<StudentSeatNumbersService>(StudentSeatNumbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
