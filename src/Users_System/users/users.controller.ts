import
{
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
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import
{
  CreateUserDto,
  CreateUserHasRolesDto,
  CreateUserHasSchoolsDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards( JwtAuthGuard )
@ApiTags( 'Users' )
@Controller( 'users' )
export class UsersController
{
  constructor ( private readonly usersService: UsersService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create ( @Body() createUserDto: CreateUserDto, @Req() req: Request )
  {
    return this.usersService.create(
      createUserDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Get()
  findAll ()
  {
    return this.usersService.findAll();
  }
  @Get( 'created-by' )
  findAllCreatedBy ( @Req() req: Request )
  {
    return this.usersService.findAllCreatedBy(
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  // @Get('school/:id')
  // findAllBySchoolId(@Param('id') id: string) {
  //   return this.usersService.findAllBySchoolId(+id);
  // }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.usersService.findOne( +id );
  }
  @Roles( Role.SuperAdmin )
  @Patch( ':id' )
  update (
    @Param( 'id' ) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  )
  {
    return this.usersService.update(
      +id,
      updateUserDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'add-roles/:id' )
  addRolesToUser (
    @Param( 'id' ) id: string,
    @Body() createUserHasRoles: CreateUserHasRolesDto[],
    @Req() req: Request,
  )
  {
    return this.usersService.AddRolesToUser(
      +id,
      createUserHasRoles,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'add-schools/:id' )
  addSchoolsToUser (
    @Param( 'id' ) id: string,
    @Body() createUserHasSchools: CreateUserHasSchoolsDto[],
  )
  {
    return this.usersService.AddSchoolsToUser( +id, createUserHasSchools );
  }

  @Roles( Role.SuperAdmin )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.usersService.remove( +id );
  }
  @Roles( Role.SuperAdmin )
  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.usersService.activate( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.usersService.deactivate( +id );
  }
}
