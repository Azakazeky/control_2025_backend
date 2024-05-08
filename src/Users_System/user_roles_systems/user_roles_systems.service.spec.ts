import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesSystemsService } from './user_roles_systems.service';

describe('UserRolesSystemsService', () => {
  let service: UserRolesSystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRolesSystemsService],
    }).compile();

    service = module.get<UserRolesSystemsService>(UserRolesSystemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
