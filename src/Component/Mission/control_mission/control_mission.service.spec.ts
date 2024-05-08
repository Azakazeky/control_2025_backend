import { Test, TestingModule } from '@nestjs/testing';
import { ControlMissionService } from './control_mission.service';

describe('ControlMissionService', () => {
  let service: ControlMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlMissionService],
    }).compile();

    service = module.get<ControlMissionService>(ControlMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
