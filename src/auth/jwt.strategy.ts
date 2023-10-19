import { ExtractJwt, JwtPayload, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

/**
 * Jwt Strategy Class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor

//    * @param {ProfileService} profileService
   */
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'crypto',
    });
  }

  /**
   * Checks if the bearer token is a valid token
   * @param {JwtPayload} jwtPayload validation method for jwt token
   * @param {any} done callback to resolve the request user with
   * @returns {Promise<boolean>} whether or not to validate the jwt token
   */
  async validate({ iat, exp, _id }: JwtPayload, done): Promise<boolean> {
    console.log('jwtPayload', iat, exp, _id);
    const timeDiff = exp - iat;
    let user;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    user = await this.userService.getUserById(_id);

    console.log('user', user);

    done(null, {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      _id: user._id,
    });
    return true;
  }
}
