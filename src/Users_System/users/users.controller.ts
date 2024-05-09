import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Users" )
@UseGuards( PrismaExceptionFilter )
@Controller( 'users' )
export class UsersController
{
  constructor ( private readonly usersService: UsersService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createUserDto: CreateUserDto )
  {
    return this.usersService.create( createUserDto );
  }

  @Get()
  findAll ()
  {
    return this.usersService.findAll();
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.usersService.findOne( +id );
  }
  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateUserDto: UpdateUserDto )
  {
    return this.usersService.update( +id, updateUserDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.usersService.remove( +id );
  }
}
