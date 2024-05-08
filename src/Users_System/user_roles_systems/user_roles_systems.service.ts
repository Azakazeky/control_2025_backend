import { Injectable } from '@nestjs/common';
import { CreateUserRolesSystemDto } from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';

@Injectable()
export class UserRolesSystemsService {
  create(createUserRolesSystemDto: CreateUserRolesSystemDto) {
    return 'This action adds a new userRolesSystem';
  }

  findAll() {
    return `This action returns all userRolesSystems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRolesSystem`;
  }

  update(id: number, updateUserRolesSystemDto: UpdateUserRolesSystemDto) {
    return `This action updates a #${id} userRolesSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRolesSystem`;
  }
}
