import { Test, TestingModule } from '@nestjs/testing';
import { SchoolTypeController } from './school_type.controller';
import { SchoolTypeService } from './school_type.service';

describe('SchoolTypeController', () => {
  let controller: SchoolTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolTypeController],
      providers: [SchoolTypeService],
    }).compile();

    controller = module.get<SchoolTypeController>(SchoolTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
