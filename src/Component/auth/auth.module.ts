import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './startgy/jwt.strategy';
import { UsersModule } from 'src/Users_System/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[UsersModule,
    JwtModule.register({
      secret: 'asdfds$23cdscads^^3243',
      signOptions: { expiresIn: '60s' },
    }),
  ]

})
export class AuthModule {}
