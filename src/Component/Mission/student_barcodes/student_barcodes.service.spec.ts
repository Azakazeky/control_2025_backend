import { Test, TestingModule } from '@nestjs/testing';
import { StudentBarcodesService } from './student_barcodes.service';

describe('StudentBarcodesService', () => {
  let service: StudentBarcodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentBarcodesService],
    }).compile();

    service = module.get<StudentBarcodesService>(StudentBarcodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
