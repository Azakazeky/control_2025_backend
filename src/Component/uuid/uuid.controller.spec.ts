import { Test, TestingModule } from '@nestjs/testing';
import { UuidController } from './uuid.controller';
import { UuidService } from './uuid.service';

describe('UuidController', () => {
  let controller: UuidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UuidController],
      providers: [UuidService],
    }).compile();

    controller = module.get<UuidController>(UuidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
