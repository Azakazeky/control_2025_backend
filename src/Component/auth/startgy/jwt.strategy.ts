import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * This is a Passport strategy for validating a JWT token.
 * It extracts the JWT token from the Authorization header,
 * verifies its signature and expiration date, and returns the
 * payload of the token.
 *
 * @see https://github.com/mikenicholson/passport-jwt
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor of the JwtStrategy.
   * It takes an options object with the following properties:
   * - `jwtFromRequest`: a function that extracts the JWT token
   *   from the request.
   * - `ignoreExpiration`: a boolean that indicates whether the
   *   expiration date of the JWT token should be ignored.
   * - `secretOrKey`: the secret key that is used to sign the JWT
   *   token.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'C2287E7F65DB21F3',
      // process.env.ACCESS_SECRET,
    });
  }

  /**
   * The `validate` method is called when the strategy is used to
   * authenticate a request.
   * It takes the payload of the JWT token and returns a user object
   * with the following properties:
   * - `userId`: the ID of the user.
   *
   * @param payload - the payload of the JWT token.
   * @returns - a user object.
   */
  validate(payload) {
    return {
      userId: payload.userId,
    };
  }
}
