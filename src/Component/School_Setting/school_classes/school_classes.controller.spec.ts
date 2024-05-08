import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassesController } from './school_classes.controller';
import { SchoolClassesService } from './school_classes.service';

describe('SchoolClassesController', () => {
  let controller: SchoolClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolClassesController],
      providers: [SchoolClassesService],
    }).compile();

    controller = module.get<SchoolClassesController>(SchoolClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
