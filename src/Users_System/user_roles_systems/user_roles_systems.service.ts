import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ConnectRolesToScreens, CreateUserRolesSystemDto } from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';

@Injectable()
export class UserRolesSystemsService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createUserRolesSystemDto: CreateUserRolesSystemDto )
  {
    var result = await this.prismaService.roles.create( {
      data: createUserRolesSystemDto
    } );
    return result;
  }



  // Todo! please check this
  async connectScreen ( id: number, connectRolesToScreens: ConnectRolesToScreens[] )
  {
    var result = await this.prismaService.roles.update( {
      where: {
        ID: id
      },
      data: {
        roles_has_screens: {
          createMany: {
            data: connectRolesToScreens
          }
        }
      }
    } );


    // var result = await this.prismaService.roles.update(
    //   {
    //     where: {
    //       ID: id
    //     },
    //     data: {
    //       roles_has_screens: {
    //         createMany: {
    //           data: screensId
    //         }
    //       }
    //     }
    //   }
    // );
    return result;

  }






  async findAll ()
  {
    var results = await this.prismaService.roles.findMany( {

    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.roles.findUnique( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  async update ( id: number, updateUserRolesSystemDto: UpdateUserRolesSystemDto )
  {
    var result = this.prismaService.roles.update( {
      where: {
        ID: id
      },
      data: updateUserRolesSystemDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.roles.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }
}
