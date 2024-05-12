import { Injectable } from '@nestjs/common';
import { ConnectRolesToScreens, CreateUserRolesSystemDto } from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { Prisma } from '@prisma/client/';

@Injectable()
export class UserRolesSystemsService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserRolesSystemDto: CreateUserRolesSystemDto) {
    var result = await this.prismaService.roles.create({
      data: createUserRolesSystemDto
    });
    return result;
  }



  async connectScreen(id: number, screensId:Prisma.roles_has_screensCreateManyRolesInput[]) {
    var connectRolesToScreens: [any] = [ConnectRolesToScreens];

    // for (const key in screensId) {
    //   var object: ConnectRolesToScreens;
    //   object.Roles_ID = id,
    //     object.Screens_ID = screensId[key]

    //   connectRolesToScreens.push(object);
    // }
    // var result = await this.prismaService.roles_has_screens.createMany({
    //   data: connectRolesToScreens
    // });
    

    var result=await this.prismaService.roles.update(
      {
        where:{
          ID:id
        },
        data:{
          roles_has_screens:{
            createMany:{
              data:screensId
            }
          }
        }
      }
    )
    return result;

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
