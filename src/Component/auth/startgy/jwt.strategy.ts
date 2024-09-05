import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'C2287E7F65DB21F3',
      // process.env.ACCESS_SECRET,
    });
  }

  validate(payload) {
    return {
      userId: payload.userId,
    };
  }
}
