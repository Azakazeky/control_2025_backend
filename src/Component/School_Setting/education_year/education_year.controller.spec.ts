import { Test, TestingModule } from '@nestjs/testing';
import { EducationYearController } from './education_year.controller';
import { EducationYearService } from './education_year.service';

describe('EducationYearController', () => {
  let controller: EducationYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationYearController],
      providers: [EducationYearService],
    }).compile();

    controller = module.get<EducationYearController>(EducationYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
