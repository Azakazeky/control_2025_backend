import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createUserCreateUserDto: CreateUserDto )
  {
    var result = await this.prismaService.users.create( {
      data: createUserCreateUserDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.users.findMany( {

    } );

    return results;
  }


  async findOne ( id: number )
  {
    var result = await this.prismaService.users.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateUserCreateUserDto: UpdateUserDto )
  {
    var result = await this.prismaService.users.update( {
      where: {
        ID: id
      },
      data: updateUserCreateUserDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.users.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }
}
