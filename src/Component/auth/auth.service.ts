import { Injectable } from '@nestjs/common';
// import { users } from '@prisma/client';
import RefreshToken from './entities/refreshtoken.entities';
import { sign, verify } from 'jsonwebtoken';
import { users } from '@prisma/client';
import * as path from 'path';
var admin = require("firebase-admin");
import { JwtService } from '@nestjs/jwt';

import { BadRequestException } from '@nestjs/common/exceptions';
import { UsersService } from 'src/Users_System/users/users.service';




@Injectable()

export class AuthService {
    private refreshTokens: RefreshToken[] = [];
    constructor(private readonly userServer: UsersService,
        private jwtService: JwtService
    ) { }

    async refresh(refreshStr: string): Promise<String | undefined> {

        const refresToken = await this.retrieveRefreshToken(refreshStr);
        if (!refresToken) {
            return undefined;
        }
        const user = await this.userServer.findOne(refresToken.userId);
        if (!user) {
            return undefined;
        }

        return sign(
            {
                userId: refresToken.userId,
                roles: refresToken.roles,
            },
            process.env.ACCESS_SECRET,
            {
                expiresIn: '1h',
            },

        );
    }

    private retrieveRefreshToken(
        refreshStr: string,
    ): Promise<RefreshToken | undefined> {
        try {
            // verify is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
            const decoded = verify(refreshStr, process.env.REFRESH_SECRET);
            if (typeof decoded === 'string') {
                return undefined;
            }
            return Promise.resolve(
                this.refreshTokens.find((token) => token.id === decoded.id),
            );
        } catch (e) {
            return undefined;
        }
    }


    async login(userName: string,
        password: string,
        mobile: number
    ): Promise<{ accessToken: string; refreshToken: string } | undefined> {

        if (mobile == 1) {
            const user = await this.userServer.findOneProctorByUserName(userName);
            if (!user) {
                throw new BadRequestException('Procotr not found');
            }
            if (user.Password !== password) {
                throw new BadRequestException('password is not right');
            }
            return this.newRefreshAndAccessToken(user);
        } else {
            const user = await this.userServer.findOneByUserName(userName);
            if (!user) {
                return undefined;
            }
            if (user.Password !== password) {
                return undefined;
            }
            if (user.Active == 1) {

                return this.newRefreshAndAccessToken(user);
            }
            throw new BadRequestException('User is not active');
        }


    }

    private async newRefreshAndAccessToken(
        user: any,
        // user: users,
        // values: { userAgent: string; ipAddress: string },
    ): Promise<{ accessToken: string; refreshToken: string, userProfile: any }> {
        const refreshObject = new RefreshToken({
            id:
                this.refreshTokens.length === 0
                    ? 0
                    : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
            // ...values,
            userId: user.ID,
            roles:user.Roles==undefined?[]: user.Roles.map((role) => role.Name
        ),
        });
        // add refreshObject to your db in real app
        this.refreshTokens.push(refreshObject);

        return {
            refreshToken: refreshObject.sign(),
            // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
            accessToken: sign(
                {
                    userId: user.ID,
                    roles: user.Roles==undefined?[]: user.Roles.map((role) => role.Name),

                },
                process.env.ACCESS_SECRET,
                {
                    expiresIn: '1h',
                },
            ),
            userProfile: user
        };
    }

    async logout(refreshStr) {
        const refreshToken = await this.retrieveRefreshToken(refreshStr);

        if (!refreshToken) {
            return;
        }
        // delete refreshToken From db

        this.refreshTokens = this.refreshTokens.filter(
            (refreshToken: RefreshToken) => refreshToken.id !== refreshToken.id,
        );

    }

    async studentLoginForExam(email, password) {
        const { user } = await admin.auth().signInWithEmailAndPassword(email, password)

        if (!user) {
            return null;
        }
        console.log(user)



    }
    async validateRequest(request: any) {

        if (request.headers['authorization'] &&
            request.headers['authorization'].split(' ')[0] === 'Bearer' &&
            await this.jwtService.decode(request.headers['authorization'].split(' ')[1])) {

            var decodedToken = this.jwtService.decode(request.headers['authorization'].split(' ')[1]);
            console.log(decodedToken)
            request.user = {};
            request.user.userId = decodedToken.userId;
            request.user.roles = decodedToken.roles;

            return true;
        }
        else {

            return true;

        }
    }

}
