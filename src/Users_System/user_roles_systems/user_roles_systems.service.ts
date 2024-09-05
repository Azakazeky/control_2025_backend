import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import {
  ConnectRolesToScreens,
  CreateScreenDto,
  CreateUserRolesSystemDto,
} from './dto/create-user_roles_system.dto';
import { UpdateUserRolesSystemDto } from './dto/update-user_roles_system.dto';

@Injectable()
export class UserRolesSystemsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserRolesSystemDto: CreateUserRolesSystemDto) {
    var result = await this.prismaService.roles.create({
      data: createUserRolesSystemDto,
    });
    return result;
  }

  async createScreen(createScreenDto: CreateScreenDto) {
    var result = await this.prismaService.screens.create({
      data: createScreenDto,
    });
    return result;
  }

  async disconnectScreen(RoleId: number, ScreensId: number[]) {
    var result = await this.prismaService.roles_has_screens.deleteMany({
      where: {
        Roles_ID: RoleId,
        Screens_ID: {
          in: ScreensId,
        },
      },
    });
    return result;
  }

  async connectScreen(RoleId: number, ScreensId: number[]) {
    var data: ConnectRolesToScreens[] = [];
    ScreensId.forEach((screen) => {
      var temp: ConnectRolesToScreens = new ConnectRolesToScreens();
      temp.Roles_ID = RoleId;
      temp.Screens_ID = screen;
      data.push(temp);
    });

    var result = await this.prismaService.roles_has_screens.createMany({
      data,
    });

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

  async findAll() {
    var results = await this.prismaService.roles.findMany({
      include: {
        roles_has_screens: {
          include: {
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
    });
    results.map((e) => {
      let screens = [];
      e.roles_has_screens.forEach((s) => screens.push(s.screens));
      (e as any).screens = screens;
      e.roles_has_screens = undefined;
    });
    return results;
  }

  async findAllScreens() {
    var results = await this.prismaService.screens.findMany({});
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.roles.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(id: number, updateUserRolesSystemDto: UpdateUserRolesSystemDto) {
    var result = this.prismaService.roles.update({
      where: {
        ID: id,
      },
      data: updateUserRolesSystemDto,
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.roles.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }
}
