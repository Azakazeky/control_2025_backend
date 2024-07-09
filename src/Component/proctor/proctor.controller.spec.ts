import { Test, TestingModule } from '@nestjs/testing';
import { ProctorController } from './proctor.controller';
import { ProctorService } from './proctor.service';

describe('ProctorController', () => {
  let controller: ProctorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProctorController],
      providers: [ProctorService],
    }).compile();

    controller = module.get<ProctorController>(ProctorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
