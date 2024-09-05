import { Test, TestingModule } from '@nestjs/testing';
import { StudentBarcodesController } from './student_barcodes.controller';
import { StudentBarcodesService } from './student_barcodes.service';

describe('StudentBarcodesController', () => {
  let controller: StudentBarcodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentBarcodesController],
      providers: [StudentBarcodesService],
    }).compile();

    controller = module.get<StudentBarcodesController>(
      StudentBarcodesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
