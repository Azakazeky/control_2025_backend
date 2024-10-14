import { Injectable } from '@nestjs/common';
// import { users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import RefreshToken from './entities/refresh-token';
var admin = require('firebase-admin');

import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import Role from 'src/Common/Guard/role.enum';
import { UsersService } from 'src/Users_System/users/users.service';

/**
 * AuthService
 *
 * @description This service is used to handle authentication
 */
@Injectable()
export class AuthService {
  /**
   * Constructor
   *
   * @param userServer UsersService
   * @param jwtService JwtService
   */
  constructor(
    private readonly userServer: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Refresh
   *
   * @description Refresh the access token and return it
   * @param refreshStr string The refresh token
   * @returns string | undefined The new access token or undefined if the refresh token is invalid
   */
  async refresh(refreshStr: string): Promise<string | undefined> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);
    if (!refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    const user = await this.userServer.findOne(refreshToken.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return sign(
      {
        schoolId: refreshToken.schoolId ?? user.LastSelectSchoolId,
        userId: refreshToken.userId,
        roles: refreshToken.roles,
        type: refreshToken.type,
      },
      'C2287E7F65DB21F3',
      {
        expiresIn: '1h',
      },
    );
  }

  /**
   * Retrieve Refresh Token
   *
   * @description Retrieve the refresh token from the database
   * @param refreshStr string The refresh token
   * @returns RefreshToken | undefined The refresh token or undefined if it is invalid
   */
  private async retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      // verify is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
      const decoded = verify(
        refreshStr,
        '22555BB344931F6EB4D6C6C3973F1',
      ) as JwtPayload;
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      // Check if the token is expired
      if (decoded.exp && decoded.exp < now) {
        return undefined;
      }
      return Promise.resolve(
        decoded as RefreshToken,
        // this.refreshTokens.find((token) => token.id === decoded.id),
      );
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Login
   *
   * @description Login the user and return the access token and refresh token
   * @param userName string The username
   * @param password string The password
   * @param mobile number The mobile number
   * @returns { accessToken: string; refreshToken: string } | undefined The access token and refresh token or undefined if the user is not found
   */
  async login(
    userName: string,
    password: string,
    mobile: number,
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    if (mobile == 1) {
      const user = await this.userServer.findOneProctorByUserName(userName);
      if (!user) {
        throw new BadRequestException(
          'Proctor Not Found PLease Make Sure You Typed The Correct Username',
        );
      }
      if (user.Password !== password) {
        throw new BadRequestException(
          'Wrong Password PLease Make Sure You Typed The Correct Password',
        );
      }
      (user as any).Roles = [{ Name: Role.Proctor }];
      user.Password = undefined;
      return this.newRefreshAndAccessToken(
        user,
        user.isFloorManager ?? 'proctor',
      );
    } else {
      const user = await this.userServer.findOneByUserName(userName);
      if (!user) {
        throw new BadRequestException(
          'User Not Found PLease Make Sure You Typed The Correct Username',
        );
      }
      if (user.Password !== password) {
        throw new BadRequestException(
          'Wrong Password PLease Make Sure You Typed The Correct Password',
        );
      }
      if (user.Active == 1) {
        user.Password = undefined;
        return this.newRefreshAndAccessToken(user, 'user');
      }
      throw new BadRequestException(
        'Your account has been deactivated. \nPlease contact your administrator.',
      );
    }
  }

  /**
   * Update User Token
   *
   * @description Update the user token and return the access token and refresh token
   * @param userId number The user id
   * @param type string The type of the user
   * @param schoolId number The school id
   * @returns { accessToken: string; refreshToken: string } | undefined The access token and refresh token or undefined if the user is not found
   */
  async updateUserToken(
    userId: number,
    type: string,
    schoolId?: number,
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    const user = await this.userServer.updateSelectedSchool(userId, schoolId);
    if (!user) {
      return undefined;
    }

    user.Password = undefined;

    return this.newRefreshAndAccessToken(user, type);
  }

  /**
   * New Refresh And Access Token
   *
   * @description Create a new refresh token and access token
   * @param user any The user object
   * @param type string The type of the user
   * @returns { accessToken: string; refreshToken: string } The access token and refresh token
   */
  private async newRefreshAndAccessToken(
    user: any,
    type: string,
    // user: users,
    // values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string; userProfile: any }> {
    const refreshObject = new RefreshToken({
      // id:,
      // this.refreshTokens.length === 0
      //   ? 0
      //   : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
      // ...values,
      schoolId: user.School_Id ?? user.LastSelectSchoolId,

      userId: user.ID,
      roles: user.Roles == undefined ? [] : user.Roles.map((role) => role.Name),
      type: type,
    });
    // add refreshObject to your db in real app
    // this.refreshTokens = this.refreshTokens.filter(
    //   (item) => item.userId != refreshObject.userId,
    // );

    // this.refreshTokens.push(refreshObject);

    return {
      refreshToken: refreshObject.sign(),
      // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
      accessToken: sign(
        {
          userId: user.ID,
          schoolId: user.School_Id ?? user.LastSelectSchoolId,
          roles:
            user.Roles == undefined ? [] : user.Roles.map((role) => role.Name),
          type: type,
        },
        'C2287E7F65DB21F3',
        {
          expiresIn: '1h',
        },
      ),
      userProfile: user,
    };
  }

  /**
   * Logout
   *
   * @description Logout the user and delete the refresh token
   * @param refreshStr string The refresh token
   */
  async logout(refreshStr) {
    // const refreshToken = await this.retrieveRefreshToken(refreshStr);
    // if (!refreshToken) {
    //   return;
    // }
    // delete refreshToken From db
    // this.refreshTokens = this.refreshTokens.filter(
    //   (refreshToken: RefreshToken) => refreshToken.id !== refreshToken.id,
    // );
  }

  /**
   * Student Login For Exam
   *
   * @description Login the student and return the access token and refresh token
   * @param userName string The username
   * @param password string The password
   * @returns { accessToken: string; refreshToken: string } | undefined The access token and refresh token or undefined if the student is not found
   */
  async studentLoginForExam(
    userName: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    const student = await this.userServer.findOneStudentByUserName(userName);
    if (!student) {
      throw new NotFoundException(
        'Student Not Found PLease Make Sure You Typed The Correct Username',
      );
    }
    if (student.Password !== password) {
      throw new BadRequestException(
        'Wrong Password PLease Make Sure You Typed The Correct Password',
      );
    }
    (student as any).Roles = [{ Name: Role.Student }];
    student.Password = undefined;

    return this.newRefreshAndAccessToken(student, 'student');
  }

  /**
   * Validate Request
   *
   * @description Validate the request and return true if the user is authenticated
   * @param request any The request object
   * @returns boolean true if the user is authenticated
   */
  async validateRequest(request: any) {
    if (
      request.headers['authorization'] &&
      request.headers['authorization'].split(' ')[0] === 'Bearer' &&
      (await this.jwtService.decode(
        request.headers['authorization'].split(' ')[1],
      ))
    ) {
      var decodedToken = this.jwtService.decode(
        request.headers['authorization'].split(' ')[1],
      );
      console.log('Decoded Token:', decodedToken);
      request.headers['user'] = {};
      request.headers['user']['userId'] = decodedToken.userId;
      request.headers['user']['roles'] = decodedToken.roles;
      request.headers['user']['schoolId'] = decodedToken.schoolId;
      request.headers['user']['type'] = decodedToken.type;

      return true;
    } else {
      return true;
    }
  }
}
