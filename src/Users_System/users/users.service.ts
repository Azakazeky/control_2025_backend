import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateUserDto, CreateUserHasRolesDto, CreateUserHasSchoolsDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserCreateUserDto: CreateUserDto) {
    var result = await this.prismaService.users.create({
      data: createUserCreateUserDto
    });
    return result;
  }

  async findAll() {
    var results = await this.prismaService.users.findMany({

    });

    return results;
  }

  async AddRolesToUser(id: number, userHasRoles: CreateUserHasRolesDto[]) {

    var result = await this.prismaService.users.update({
      where: {
        ID: id
      },
      data: {
        users_has_roles: {
          createMany: {
            data: userHasRoles
          }
        }
      }
    });
    return result;
  } async AddSchoolsToUser(id: number, userHasRoles: CreateUserHasSchoolsDto[]) {
    var result = await this.prismaService.users.update({
      where: {
        ID: id
      },
      data: {
        users_has_schools: {
          createMany: {
            data: userHasRoles
          }
        }
      }
    });
    return result;
  }

  async findOne(id: number) {
    var result = await this.prismaService.users.findUnique({
      where: {
        ID: id
      },
      include: {
        users_has_roles: {
          select: {
            roles: {
              select: {
                Name: true
              }
            }
          }
        }
      }

    });
    return result;
  }


  async findOneByUserName(userName: string) {
    var result = await this.prismaService.users.findUnique({
      where: {
        User_Name: userName
      },
      include: {
        users_has_roles: {
          select: {
            roles: {
              select: {
                Name: true
              }
            }
          }
        },
        users_has_schools: true
      }

    });
    return result;
  }

  async update(id: number, updateUserCreateUserDto: UpdateUserDto) {
    var result = await this.prismaService.users.update({
      where: {
        ID: id
      },
      data: updateUserCreateUserDto
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.users.delete({
      where: {
        ID: id
      }
    });
    return result;
  }

  ///////******************* Proctors */


  async findOneProctor(id: number) {
    var result = await this.prismaService.users.findUnique({
      where: {
        ID: id
      },

    });
    return result;

  }
  async findOneProctorByUserName(userName: string) {
    var result = await this.prismaService.users.findUnique({
      where: {
        User_Name: userName
      },

    });
    return result;

  }


}
