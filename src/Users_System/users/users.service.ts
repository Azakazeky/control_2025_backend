import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import
{
  CreateUserDto,
  CreateUserHasRolesDto,
  CreateUserHasSchoolsDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createUserCreateUserDto: CreateUserDto, createdBy: number )
  {
    var result = await this.prismaService.users.create( {
      data: {
        Full_Name: createUserCreateUserDto.Full_Name,
        User_Name: createUserCreateUserDto.User_Name,
        Password: createUserCreateUserDto.Password,
        Type: createUserCreateUserDto.Type,
      },
    } );
    if ( createUserCreateUserDto.Type == 1 )
    {
      await this.prismaService.proctors.create( {
        data: {
          School_Id: createUserCreateUserDto.School_Id,
          Full_Name: createUserCreateUserDto.Full_Name,
          User_Name: createUserCreateUserDto.User_Name,
          Password: createUserCreateUserDto.Password,
          Created_By: createdBy,
          isFloorManager: 'School Director',
        },
      } );
    } else if (
      createUserCreateUserDto.Type == 3 ||
      createUserCreateUserDto.Type == 5
    )
    {
      await this.prismaService.proctors.create( {
        data: {
          School_Id: createUserCreateUserDto.School_Id,
          Full_Name: createUserCreateUserDto.Full_Name,
          User_Name: createUserCreateUserDto.User_Name,
          Password: createUserCreateUserDto.Password,
          Created_By: result.ID,
          Division: createUserCreateUserDto.IsFloorManager,
          isFloorManager: createUserCreateUserDto.IsFloorManager,
        },
      } );
    }
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.users.findMany( {} );

    return results;
  }

  // async findAllBySchoolId(schoolId: number) {
  //   var results = await this.prismaService.users.findMany({
  //     where: {
  //       Schools_ID: schoolId,
  //     },
  //   });

  //   return results;
  // }

  async AddRolesToUser (
    id: number,
    userHasRoles: CreateUserHasRolesDto[],
    createdBy: number,
  )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id,
      },
      data: {
        users_has_roles: {
          createMany: {
            data: userHasRoles.map( ( userHasRole ) => ( {
              Created_By: createdBy,
              Roles_ID: userHasRole.Roles_ID,
            } ) ),
          },
        },
      },
    } );
    return result;
  }
  async AddSchoolsToUser ( id: number, userHasRoles: CreateUserHasSchoolsDto[] )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id,
      },
      data: {
        users_has_schools: {
          createMany: {
            data: userHasRoles,
          },
        },
      },
    } );
    return result;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.users.findUnique( {
      where: {
        ID: id,
      },
      include: {
        users_has_roles: {
          select: {
            roles: {
              select: {
                Name: true,
              },
            },
          },
        },
      },
    } );
    return result;
  }

  async findOneStudentByUserName ( userName: string )
  {
    var result = await this.prismaService.student.findUnique( {
      where: {
        User_Name: userName,
      },
      select: {
        ID: true,
        Blb_Id: true,
        First_Name: true,
        Second_Name: true,
        Third_Name: true,
        User_Name: true,
        Password: true,
        grades: {
          select: {
            ID: true,
            Name: true,
          }
        },
        schools: {
          select: {
            ID: true,
            Name: true,
            school_type: {
              select: {
                Name: true,
              }
            }
          }
        },
      },
    } );
    return result;
  }

  async findOneByUserName ( userName: string )
  {
    var result = await this.prismaService.users.findUnique( {
      where: {
        User_Name: userName,
      },
      include: {
        users_has_roles: {
          select: {
            roles: {
              select: {
                ID: true,
                Name: true,
                roles_has_screens: {
                  select: {
                    screens: {
                      select: {
                        ID: true,
                        Name: true,
                        Front_Id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        users_has_schools: true,
      },
    } );

    var roles = [];
    result.users_has_roles.forEach( ( role ) =>
    {
      roles.push( role.roles );
    } );

    ( result as any ).Roles = roles;
    result.users_has_roles = undefined;

    return result;
  }

  async update (
    id: number,
    updateUserCreateUserDto: UpdateUserDto,
    updatedBy: number,
  )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id,
      },
      data: {
        ...updateUserCreateUserDto,
        Updated_By: updatedBy,
        Updated_At: new Date().toISOString(),
      },
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.users.delete( {
      where: {
        ID: id,
      },
    } );
    return result;
  }

  ///////******************* Proctors */

  async findOneProctor ( id: number )
  {
    var result = await this.prismaService.users.findUnique( {
      where: {
        ID: id,
      },
    } );
    return result;
  }
  async findOneProctorByUserName ( userName: string )
  {
    var result = await this.prismaService.proctors.findUnique( {
      where: {
        User_Name: userName,
      },
    } );
    return result;
  }

  async activate ( id: number )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id,
      },
      data: {
        Active: 1,
      },
    } );
    return result;
  }

  async deactivate ( id: number )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    } );
    return result;
  }
}
