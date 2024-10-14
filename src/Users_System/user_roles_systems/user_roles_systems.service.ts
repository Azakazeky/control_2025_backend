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
  /**
   * Creates a new user roles system.
   * @param createUserRolesSystemDto The CreateUserRolesSystemDto to be used to create the new user roles system.
   * @returns The newly created user roles system.
   */
  async create(createUserRolesSystemDto: CreateUserRolesSystemDto) {
    var result = await this.prismaService.roles.create({
      data: createUserRolesSystemDto,
    });
    return result;
  }

  /**
   * Creates a new screen.
   * @param createScreenDto The CreateScreenDto to be used to create the new screen.
   * @returns The newly created screen.
   */
  async createScreen(createScreenDto: CreateScreenDto) {
    var result = await this.prismaService.screens.create({
      data: createScreenDto,
    });
    return result;
  }

  /**
   * Disconnects the role with the given id from the given array of screen ids.
   * @param RoleId The id of the role to be disconnected.
   * @param ScreensId The array of screen ids to disconnect the role from.
   * @returns The result of the disconnection.
   */
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

  /**
   * Connects the role with the given id to the given array of screen ids.
   * @param RoleId The id of the role to be connected.
   * @param ScreensId The array of screen ids to connect the role to.
   * @returns The result of the connection.
   */
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

  /**
   * Returns all user roles systems.
   * @returns An array of user roles systems.
   * The results are modified so that the roles_has_screens field is replaced with
   * a screens field that contains an array of the screens associated with each role.
   */
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

  /**
   * Retrieves all the screens for the user roles system.
   * @returns An array of all the screens.
   */
  async findAllScreens() {
    var results = await this.prismaService.screens.findMany({});
    return results;
  }

  /**
   * Finds a user roles system by the given id.
   * @param id The id of the user roles system to find.
   * @returns The user roles system with the given id or undefined if it does not exist.
   */
  async findOne(id: number) {
    var result = await this.prismaService.roles.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Updates a user roles system.
   * @param id The id of the user roles system to be updated.
   * @param updateUserRolesSystemDto The UpdateUserRolesSystemDto to be used to update the user roles system.
   * @returns The updated user roles system.
   */
  async update(id: number, updateUserRolesSystemDto: UpdateUserRolesSystemDto) {
    var result = this.prismaService.roles.update({
      where: {
        ID: id,
      },
      data: updateUserRolesSystemDto,
    });
    return result;
  }

  /**
   * Deletes a user roles system by the given id.
   * @param id The id of the user roles system to be deleted.
   * @returns The result of the deletion.
   */
  async remove(id: number) {
    var result = await this.prismaService.roles.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }
}
