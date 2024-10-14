import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import {
  CreateUserDto,
  CreateUserHasRolesDto,
  CreateUserHasSchoolsDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new user. The user will be created with the given
   * `createUserCreateUserDto` and the given `createdBy` and `schoolId`.
   * The user will be created with the given `Type` and `Full_Name` and
   * `User_Name` and `Password`. If the `Type` is 6, the user will be
   * created with all schools. If the `Type` is 1, the user will be
   * created as a proctor with the given `Full_Name` and `User_Name`
   * and `Password` and `School_Id` and `isFloorManager` set to 'School
   * Director'. If the `Type` is 3 or 5, the user will be created as a
   * proctor with the given `Full_Name` and `User_Name` and `Password`
   * and `School_Id` and `Division` and `isFloorManager` set to the
   * given `IsFloorManager`. The created user will be returned.
   * @param createUserCreateUserDto The user data to be created.
   * @param createdBy The user who is creating the user.
   * @param schoolId The school id of the user.
   * @returns The newly created user.
   */
  async create(
    createUserCreateUserDto: CreateUserDto,
    createdBy: number,
    schoolId: number,
  ) {
    if (createUserCreateUserDto.Type == 6) {
      var schools = await this.prismaService.schools.findMany({
        select: {
          ID: true,
        },
      });

      if (schools.length == 0) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Schools Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        var result = await this.prismaService.users.create({
          data: {
            Full_Name: createUserCreateUserDto.Full_Name,
            User_Name: createUserCreateUserDto.User_Name,
            Password: createUserCreateUserDto.Password,
            Type: createUserCreateUserDto.Type,
            Created_By: createdBy,
            users_has_schools: {
              createMany: {
                data: schools.map((school) => {
                  return {
                    Schools_ID: school.ID,
                  };
                }),
              },
            },
          },
          select: {
            ID: true,
            Active: true,
            Created_At: true,
            Created_By: true,
            Full_Name: true,
            Type: true,
            User_Name: true,
            CreatedById: {
              select: {
                Full_Name: true,
                User_Name: true,
              },
            },
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
        });
        return result;
      }
    }
    var result = await this.prismaService.users.create({
      data: {
        Full_Name: createUserCreateUserDto.Full_Name,
        User_Name: createUserCreateUserDto.User_Name,
        Password: createUserCreateUserDto.Password,
        Type: createUserCreateUserDto.Type,
        Created_By: createdBy,
        users_has_schools: {
          create: {
            Schools_ID: schoolId,
          },
        },
      },
      select: {
        ID: true,
        Active: true,
        Created_At: true,
        Created_By: true,
        Full_Name: true,
        Type: true,
        User_Name: true,
        CreatedById: {
          select: {
            Full_Name: true,
            User_Name: true,
          },
        },
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
    });
    if (createUserCreateUserDto.Type == 1) {
      await this.prismaService.proctors.create({
        data: {
          School_Id: createUserCreateUserDto.School_Id,
          Full_Name: createUserCreateUserDto.Full_Name,
          User_Name: createUserCreateUserDto.User_Name,
          Password: createUserCreateUserDto.Password,
          Created_By: createdBy,
          isFloorManager: 'School Director',
        },
      });
    } else if (
      createUserCreateUserDto.Type == 3 ||
      createUserCreateUserDto.Type == 5
    ) {
      await this.prismaService.proctors.create({
        data: {
          School_Id: createUserCreateUserDto.School_Id,
          Full_Name: createUserCreateUserDto.Full_Name,
          User_Name: createUserCreateUserDto.User_Name,
          Password: createUserCreateUserDto.Password,
          Created_By: createdBy,
          Division: createUserCreateUserDto.IsFloorManager,
          isFloorManager: createUserCreateUserDto.IsFloorManager,
        },
      });
    }
    return result;
  }

  /**
   * Creates a new user who is a reader user.
   * @param createUserCreateUserDto the user data to be created
   * @param createdBy the id of the user who is creating this user
   * @returns the newly created user
   */
  async createReaderUser(
    createUserCreateUserDto: CreateUserDto,
    createdBy: number,
  ) {
    var result = await this.prismaService.users.create({
      data: {
        Full_Name: createUserCreateUserDto.Full_Name,
        User_Name: createUserCreateUserDto.User_Name,
        Password: createUserCreateUserDto.Password,
        Type: createUserCreateUserDto.Type,
        Created_By: createdBy,
        users_has_roles: {
          connect: {
            ID: 8,
          },
        },
      },
      select: {
        ID: true,
        Active: true,
        Created_At: true,
        Created_By: true,
        Full_Name: true,
        Type: true,
        User_Name: true,
        CreatedById: {
          select: {
            Full_Name: true,
            User_Name: true,
          },
        },
        users_has_roles: {
          select: {
            roles: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  /**
   * Retrieves all users in the system, including their roles and schools.
   * @returns an array of users. Each user object includes the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async findAll() {
    var results = await this.prismaService.users.findMany({
      select: {
        ID: true,
        Active: true,
        Created_At: true,
        Created_By: true,
        Full_Name: true,
        Type: true,
        IsFloorManager: true,
        User_Name: true,
        CreatedById: {
          select: {
            Full_Name: true,
            User_Name: true,
          },
        },
        users_has_roles: {
          select: {
            roles: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return results;
  }
  /**
   * Retrieves all active users associated with a given school, including their roles and schools.
   * @param schoolId the school id
   * @returns an array of users. Each user object includes the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.users.findMany({
      where: {
        LastSelectSchoolId: schoolId,
        Active: 1,
      },
      select: {
        ID: true,
        Active: true,
        Created_At: true,
        Created_By: true,
        Full_Name: true,
        Type: true,
        IsFloorManager: true,
        User_Name: true,
        CreatedById: {
          select: {
            Full_Name: true,
            User_Name: true,
          },
        },
        users_has_roles: {
          select: {
            roles: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return results;
  }

  /**
   * Updates the selected school for a given user.
   * @param id The user id to update.
   * @param selectedSchool The school id to select.
   * @returns The user object with the selected school updated. The user object includes the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async updateSelectedSchool(id: number, selectedSchool: number) {
    var result = await this.prismaService.users.update({
      where: {
        ID: id,
      },
      data: {
        LastSelectSchoolId: selectedSchool,
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
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (result) {
      var roles = [];
      result.users_has_roles.forEach((role) => {
        roles.push(role.roles);
      });

      (result as any).Roles = roles;
      result.users_has_roles = undefined;
    }

    return result;
  }

  /**
   * Retrieves all active users created by a given user, including their roles and schools.
   * @param createdBy the user id of the user who created the users
   * @returns an array of users. Each user object includes the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async findAllCreatedBy(createdBy: number) {
    var results = await this.prismaService.users.findMany({
      where: {
        Created_By: createdBy,
        Active: 1,
      },
      select: {
        ID: true,
        Active: true,
        Created_At: true,
        Created_By: true,
        Full_Name: true,
        Type: true,
        IsFloorManager: true,
        User_Name: true,
        CreatedById: {
          select: {
            Full_Name: true,
            User_Name: true,
          },
        },
        users_has_roles: {
          select: {
            roles: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

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

  /**
   * Edits the roles of a user. The user's roles will be replaced with the given
   * `userHasRoles`. The user who is creating the roles is given as the `createdBy`
   * parameter.
   * @param userId The user id to edit.
   * @param userHasRoles The roles to be given to the user.
   * @param createdBy The user who is creating the roles.
   * @returns The result of the creation of the roles.
   */
  async editUserRoles(
    userId: number,
    userHasRoles: CreateUserHasRolesDto[],
    createdBy: number,
  ) {
    await this.prismaService.users_has_roles.deleteMany({
      where: {
        Users_ID: userId,
      },
    });
    var result = await this.prismaService.users_has_roles.createMany({
      data: userHasRoles.map((userHasRole) => {
        return {
          Users_ID: userId,
          Roles_ID: userHasRole.Roles_ID,
          Created_By: createdBy,
          Created_At: new Date(),
        };
      }),
    });

    return result;
  }
  /**
   * Adds the given `userHasRoles` to the user with the given `id`. The given
   * `userHasRoles` will be added to the user's current schools.
   * @param id The user id to add the roles to.
   * @param userHasRoles The roles to be added to the user.
   * @returns The result of the addition of the roles.
   */
  async AddSchoolsToUser(id: number, userHasRoles: CreateUserHasSchoolsDto[]) {
    var result = await this.prismaService.users.update({
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
    });
    return result;
  }

  /**
   * Retrieves a user by their id, including their roles and schools.
   * @param id The user id to retrieve.
   * @returns The user object with the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async findOne(id: number) {
    var result = await this.prismaService.users.findUnique({
      where: {
        ID: id,
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
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (result) {
      var roles = [];
      result.users_has_roles.forEach((role) => {
        roles.push(role.roles);
      });
      (result as any).Roles = roles;
      result.users_has_roles = undefined;
    }
    return result;
  }

  /**
   * Retrieves a student by user name, including the student's
   * grades and schools.
   * @param userName the user name of the student to find
   * @returns a student object with the student's id, blb id, first name, second name, third name, user name, password, grades array, and schools array. The grades array includes the grade's id and name. The schools array includes the school's id, name, and school type name.
   */
  async findOneStudentByUserName(userName: string) {
    var result = await this.prismaService.student.findUnique({
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
          },
        },
        schools: {
          select: {
            ID: true,
            Name: true,
            school_type: {
              select: {
                Name: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  /**
   * Retrieves a user by user name, including the user's roles and schools.
   * @param userName the user name of the user to find
   * @returns a user object with the user's id, active status, creation date, created by, full name, type, is floor manager, user name, and the user who created them. The user who created them is given as an object with the creator's full name and user name. The user's roles are given as an array of role objects, each with the role's id and name. The user's schools are given as an array of school objects, each with the school's id, name, active status, school type id, and school type name.
   */
  async findOneByUserName(userName: string) {
    var result = await this.prismaService.users.findUnique({
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
        users_has_schools: {
          where: {
            schools: {
              Active: 1,
            },
          },
          select: {
            schools: {
              select: {
                ID: true,
                Name: true,
                Active: true,
                School_Type_ID: true,
                school_type: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (result) {
      var roles = [];
      result.users_has_roles.forEach((role) => {
        roles.push(role.roles);
      });

      (result as any).Roles = roles;
      result.users_has_roles = undefined;
    }

    return result;
  }

  /**
   * Updates a user.
   * @param id The id of the user to update.
   * @param updateUserCreateUserDto The UpdateUserDto to be used to update the user.
   * @param updatedBy The user who is updating the user.
   * @returns The updated user.
   * @throws {HttpException} If the old password does not match, or if the new password is the same as the old password.
   */
  async update(
    id: number,
    updateUserCreateUserDto: UpdateUserDto,
    updatedBy: number,
  ) {
    if (
      updateUserCreateUserDto.OldPassword &&
      updateUserCreateUserDto.NewPassword
    ) {
      var user = await this.prismaService.users.findUnique({
        where: {
          ID: id,
        },
      });
      if (updateUserCreateUserDto.OldPassword != user.Password) {
        throw new HttpException(
          'Old Password does not match.',
          HttpStatus.FORBIDDEN,
        );
      }
      //------------------------------------------------------------------------------------------------------//
      // if ( !bcrypt.compareSync( updateUserCreateUserDto.OldPassword, user.Password ) )
      // {
      //   throw new HttpException(
      // 'Old Password does not match.',
      //   HttpStatus.FORBIDDEN,
      //   );
      // }
      else if (
        updateUserCreateUserDto.NewPassword ==
        updateUserCreateUserDto.OldPassword
      ) {
        throw new HttpException(
          'New Password cannot be same as Old Password.',
          HttpStatus.FORBIDDEN,
        );
      }

      // user.Password = bcrypt.hashSync( updateUserCreateUserDto.NewPassword, 10 );
      user.Password = updateUserCreateUserDto.NewPassword;
      user.Updated_By = updatedBy;
      user.Updated_At = new Date().toISOString();
      var result = await this.prismaService.users.update({
        where: {
          ID: id,
        },
        data: user,
      });
      return result;
      //------------------------------------------------------------------------------------------------------//
    } else {
      const { OldPassword, NewPassword, ...updateUser } =
        updateUserCreateUserDto;
      var result = await this.prismaService.users.update({
        where: {
          ID: id,
        },
        data: {
          ...updateUser,
          Updated_By: updatedBy,
          Updated_At: new Date().toISOString(),
        },
      });
      return result;
    }
  }

  /**
   * Deletes a user by their id.
   * @param id The user id to delete.
   * @returns The result of the deletion.
   */
  async remove(id: number) {
    var result = await this.prismaService.users.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }

  /**
   * Edits the schools associated with a given user. The user's associated schools will be replaced with the given
   * `schoolId` array. The user who is creating the schools is given as the `updatedBy` parameter.
   * @param userId The user id to edit.
   * @param schoolId The schools to be associated with the user.
   * @returns The result of the creation of the schools.
   */
  async editUserHasSchools(userId: number, schoolId: number[]) {
    await this.prismaService.users_has_schools.deleteMany({
      where: {
        Users_ID: userId,
      },
    });
    var result = await this.prismaService.users_has_schools.createMany({
      data: schoolId.map((schoolId) => ({
        Users_ID: userId,
        Schools_ID: schoolId,
      })),
    });

    return result;
  }

  ///////******************* Proctors */

  /**
   * Finds a proctor by their id.
   * @param id The id of the proctor to find.
   * @returns The proctor with the given id or undefined if it does not exist.
   */
  async findOneProctor(id: number) {
    var result = await this.prismaService.users.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }
  /**
   * Finds a proctor by their user name.
   * @param userName The user name of the proctor to find.
   * @returns The proctor with the given user name or undefined if it does not exist.
   */
  async findOneProctorByUserName(userName: string) {
    var result = await this.prismaService.proctors.findUnique({
      where: {
        User_Name: userName,
      },
    });
    return result;
  }

  /**
   * Activates a user.
   * @param id The id of the user to be activated.
   * @returns The result of the activation.
   */
  async activate(id: number) {
    var result = await this.prismaService.users.update({
      where: {
        ID: id,
      },
      data: {
        Active: 1,
      },
    });
    return result;
  }

  /**
   * Deactivates a user.
   * @param id The id of the user to be deactivated.
   * @returns The result of the deactivation.
   */
  async deactivate(id: number) {
    var result = await this.prismaService.users.update({
      where: {
        ID: id,
      },
      data: {
        Active: 0,
      },
    });
    return result;
  }
}
