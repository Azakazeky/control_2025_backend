import { Test, TestingModule } from '@nestjs/testing';
import { ClassDeskController } from './class_desk.controller';
import { ClassDeskService } from './class_desk.service';

describe('ClassDeskController', () => {
  let controller: ClassDeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassDeskController],
      providers: [ClassDeskService],
    }).compile();

    controller = module.get<ClassDeskController>(ClassDeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
