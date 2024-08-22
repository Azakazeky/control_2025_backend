import { Injectable } from '@nestjs/common';
// import { users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { sign, verify } from 'jsonwebtoken';
import RefreshToken from './entities/refreshtoken.entities';
var admin = require( 'firebase-admin' );

import
{
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import Role from 'src/Common/Guard/role.enum';
import { UsersService } from 'src/Users_System/users/users.service';

@Injectable()
export class AuthService
{
  private refreshTokens: RefreshToken[] = [];
  constructor (
    private readonly userServer: UsersService,
    private jwtService: JwtService,
  ) { }

  async refresh ( refreshStr: string ): Promise<string | undefined>
  {
    const refresToken = await this.retrieveRefreshToken( refreshStr );
    if ( !refresToken )
    {
      throw new BadRequestException( 'Invalid refresh token' );
    }
    const user = await this.userServer.findOne( refresToken.userId );
    if ( !user )
    {
      throw new NotFoundException( 'User not found' );
    }

    const refreshObject = new RefreshToken( {
      id:
        this.refreshTokens.length === 0
          ? 0
          : this.refreshTokens[ this.refreshTokens.length - 1 ].id + 1,
      // ...values,
      schoolId: refresToken.schoolId ?? user.LastSelectSchoolId,
      userId: user.ID,
      roles: refresToken.roles,
      type: refresToken.type,
    } );
    // add refreshObject to your db in real app
    this.refreshTokens.push( refreshObject );

    return sign(
      {
        schoolId: refresToken.schoolId ?? user.LastSelectSchoolId,
        userId: refresToken.userId,
        roles: refresToken.roles,
        type: refresToken.type,

      },
      'C2287E7F65DB21F3',
      {
        expiresIn: '1h',
      },
    );
  }

  private retrieveRefreshToken (
    refreshStr: string,
  ): Promise<RefreshToken | undefined>
  {
    try
    {
      // verify is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
      const decoded = verify( refreshStr, '22555BB344931F6EB4D6C6C3973F1' );
      if ( typeof decoded === 'string' )
      {
        return undefined;
      }
      return Promise.resolve(
        this.refreshTokens.find( ( token ) => token.id === decoded.id ),
      );
    } catch ( e )
    {
      return undefined;
    }
  }

  async login (
    userName: string,
    password: string,
    mobile: number,
  ): Promise<{ accessToken: string; refreshToken: string; } | undefined>
  {
    if ( mobile == 1 )
    {
      const user = await this.userServer.findOneProctorByUserName( userName );
      if ( !user )
      {
        throw new BadRequestException( 'Procotr not found' );
      }
      if ( user.Password !== password )
      {
        throw new BadRequestException( 'password is not right' );
      }
      ( user as any ).Roles = [ { 'Name': Role.Proctor } ];
      user.Password = undefined;
      return this.newRefreshAndAccessToken( user, user.isFloorManager ?? 'proctor' );
    } else
    {
      const user = await this.userServer.findOneByUserName( userName );
      if ( !user )
      {
        throw new BadRequestException( 'User not found' );
      }
      if ( user.Password !== password )
      {
        throw new BadRequestException( 'password is not right' );
      }
      if ( user.Active == 1 )
      {
        user.Password = undefined;
        return this.newRefreshAndAccessToken( user, 'user' );
      }
      throw new BadRequestException( 'User is not active' );
    }
  }

  async updateUserToken ( userId: number, type: string ): Promise<{ accessToken: string; refreshToken: string; } | undefined>
  {
    const user = await this.userServer.findOne( userId,
    );
    if ( !user )
    {
      return undefined;
    }

    user.Password = undefined;
    return this.newRefreshAndAccessToken( user, type );


  }

  private async newRefreshAndAccessToken (
    user: any,
    type: string
    // user: users,
    // values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string; userProfile: any; }>
  {
    const refreshObject = new RefreshToken( {
      id:
        this.refreshTokens.length === 0
          ? 0
          : this.refreshTokens[ this.refreshTokens.length - 1 ].id + 1,
      // ...values,
      schoolId: user.School_Id ?? user.LastSelectSchoolId,

      userId: user.ID,
      roles: user.Roles == undefined ? [] : user.Roles.map( ( role ) => role.Name ),
      type: type
    } );
    // add refreshObject to your db in real app
    this.refreshTokens.push( refreshObject );

    return {
      refreshToken: refreshObject.sign(),
      // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
      accessToken: sign(
        {
          userId: user.ID,
          schoolId: user.School_Id ?? user.LastSelectSchoolId,
          roles:
            user.Roles == undefined ? [] : user.Roles.map( ( role ) => role.Name ),
          type: type
        },
        'C2287E7F65DB21F3',
        {
          expiresIn: '1h',
        },
      ),
      userProfile: user,
    };
  }

  async logout ( refreshStr )
  {
    const refreshToken = await this.retrieveRefreshToken( refreshStr );

    if ( !refreshToken )
    {
      return;
    }
    // delete refreshToken From db

    this.refreshTokens = this.refreshTokens.filter(
      ( refreshToken: RefreshToken ) => refreshToken.id !== refreshToken.id,
    );
  }

  // async studentLoginForExam(email, password) {
  //   const { user } = await admin
  //     .auth()
  //     .signInWithEmailAndPassword(email, password);

  //   if (!user) {
  //     return null;
  //   }
  //   console.log(user);
  // }

  async studentLoginForExam (
    userName: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; } | undefined>
  {
    const student = await this.userServer.findOneStudentByUserName( userName );
    if ( !student )
    {
      throw new NotFoundException( 'student not found' );
    }
    if ( student.Password !== password )
    {
      throw new BadRequestException( 'password is not right' );
    }
    ( student as any ).Roles = [ { 'Name': Role.Student } ];
    student.Password = undefined;

    return this.newRefreshAndAccessToken( student, 'student' );
  }

  async validateRequest ( request: any )
  {
    if (
      request.headers[ 'authorization' ] &&
      request.headers[ 'authorization' ].split( ' ' )[ 0 ] === 'Bearer' &&
      ( await this.jwtService.decode(
        request.headers[ 'authorization' ].split( ' ' )[ 1 ],
      ) )
    )
    {
      var decodedToken = this.jwtService.decode(
        request.headers[ 'authorization' ].split( ' ' )[ 1 ],
      );
      console.log( 'Decoded Token:', decodedToken );
      request.headers[ 'user' ] = {};
      request.headers[ 'user' ][ 'userId' ] = decodedToken.userId;
      request.headers[ 'user' ][ 'roles' ] = decodedToken.roles;
      request.headers[ 'user' ][ 'schoolId' ] = decodedToken.schoolId;
      request.headers[ 'user' ][ 'type' ] = decodedToken.type;

      return true;
    } else
    {
      return true;
    }
  }
}
