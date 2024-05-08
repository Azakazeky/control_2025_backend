import { Test, TestingModule } from '@nestjs/testing';
import { ControlMissionController } from './control_mission.controller';
import { ControlMissionService } from './control_mission.service';

describe('ControlMissionController', () => {
  let controller: ControlMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlMissionController],
      providers: [ControlMissionService],
    }).compile();

    controller = module.get<ControlMissionController>(ControlMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
