import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import {
  CreateUserDto,
  CreateUserHasRolesDto,
  CreateUserHasSchoolsDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new user.
   * @param createUserDto the user data to be created
   * @param req the request object
   * @returns the newly created user
   */
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.usersService.create(
      createUserDto,
      req.headers['user']['userId'],
      req.headers['user']['schoolId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Post('create-reader-user')
  /**
   * Creates a new user who is a reader user.
   * @param createUserDto the user data to be created
   * @param req the request object
   * @returns the newly created user
   */
  createReaderUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.usersService.createReaderUser(
      createUserDto,
      req.headers['user']['userId'],
    );
  }
  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Get()
  /**
   * Retrieves all users from the database.
   * @returns an array of all users
   */
  findAll() {
    return this.usersService.findAll();
  }
  @Get('school')
  /**
   * Retrieves all users associated with the user's school.
   * @param req the request object
   * @returns all users associated with the user's school
   */
  findAllBySchoolId(@Req() req: Request) {
    return this.usersService.findAllBySchoolId(req.headers['user']['schoolId']);
  }
  @Get('created-by')
  /**
   * Retrieves all users created by the current user.
   * @param req the request object
   * @returns an array of users created by the current user
   */
  findAllCreatedBy(@Req() req: Request) {
    return this.usersService.findAllCreatedBy(req.headers['user']['userId']);
  }

  // @Get('school/:id')
  // findAllBySchoolId(@Param('id') id: string) {
  //   return this.usersService.findAllBySchoolId(+id);
  // }

  @Get(':id')
  /**
   * Retrieves a single user by its id.
   * @param id the user id
   * @returns the user with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Patch(':id')
  /**
   * Updates a user.
   * @param id the user id
   * @param updateUserDto the user data to be updated
   * @param req the request object
   * @returns the updated user
   */
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.update(
      +id,
      updateUserDto,
      req.headers['user']['userId'],
    );
  }

  @Post('edi-user-has-schools/:id')
  /**
   * Edits the schools associated with the user with the given id.
   * @param id the user id
   * @param shcoolsIds the array of school ids to be associated with the user
   * @returns the updated user
   */
  editUserHasSchools(@Param('id') id: string, @Body() shcoolsIds: number[]) {
    return this.usersService.editUserHasSchools(+id, shcoolsIds);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('edit-roles/:userId')
  /**
   * Adds the given roles to the user with the given id.
   * @param userId the user id
   * @param createUserHasRoles the array of roles to be added to the user
   * @param req the request object
   * @returns the user with the added roles
   */
  addRolesToUser(
    @Param('userId') userId: string,
    @Body() createUserHasRoles: CreateUserHasRolesDto[],
    @Req() req: Request,
  ) {
    return this.usersService.editUserRoles(
      +userId,
      createUserHasRoles,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin)
  @Patch('add-schools/:id')
  /**
   * Adds the given schools to the user with the given id.
   * @param id the user id
   * @param createUserHasSchools the array of schools to be added to the user
   * @returns the user with the added schools
   */
  addSchoolsToUser(
    @Param('id') id: string,
    @Body() createUserHasSchools: CreateUserHasSchoolsDto[],
  ) {
    return this.usersService.AddSchoolsToUser(+id, createUserHasSchools);
  }

  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Deletes a user by its id.
   * @param id the user id
   * @returns the result of the deletion
   */
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates a user by its id.
   * @param id the user id
   * @returns the activated user
   */
  activate(@Param('id') id: string) {
    return this.usersService.activate(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates a user by its id.
   * @param id the user id
   * @returns the deactivated user
   */
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(+id);
  }
}
