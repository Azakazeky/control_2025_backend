import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesSystemsController } from './user_roles_systems.controller';
import { UserRolesSystemsService } from './user_roles_systems.service';

describe('UserRolesSystemsController', () => {
  let controller: UserRolesSystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesSystemsController],
      providers: [UserRolesSystemsService],
    }).compile();

    controller = module.get<UserRolesSystemsController>(
      UserRolesSystemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
