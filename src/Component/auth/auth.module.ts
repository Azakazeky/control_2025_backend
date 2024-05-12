import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './startgy/jwt.strategy';
import { UsersModule } from 'src/Users_System/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[UsersModule]

})
export class AuthModule {}
