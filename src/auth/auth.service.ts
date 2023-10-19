import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

/**
 * Models a typical Login/Register route return body
 */
export interface ITokenReturnBody {
  /**
   * When the token is to expire in seconds
   */
  expires: string;
  /**
   * A human-readable format of expires
   */
  expiresPrettyPrint: string;
  /**
   * The Bearer token
   */
  token: string;
}

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {
  /**
   * Time in seconds when the token is to expire
   * @type {string}
   */
  private readonly expiration: string;

  /**
   * Constructor
   * @param {JwtService} jwtService jwt service
   * @param {ConfigService} configService
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UserService,
  ) {
    this.expiration = process.env.JWT_EXPIRATION;
  }

  /**
   * Creates a signed jwt token based on IProfile payload
   * @param {Profile} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async createToken({ _id, name, email }): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
      token: this.jwtService.sign({
        _id,
        name,
        email: email.toLowerCase(),
      }),
    };
  }

  /**
   * Creates a signed jwt token based on IProfile payload
   * @param {Profile} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async createRefreshToken(
    { _id, username, email, avatar }: any,
    role: any,
  ): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
      token: this.jwtService.sign({ _id, username, email, avatar, role }),
    };
  }

  /**
   * Formats the time in seconds into human-readable format
   * @param {string} time
   * @returns {string} hrf time
   */
  private static prettyPrintSeconds(time: string): string {
    const ntime = Number(time);
    const hours = Math.floor(ntime / 3600);
    const minutes = Math.floor((ntime % 3600) / 60);
    const seconds = Math.floor((ntime % 3600) % 60);

    return `${hours > 0 ? hours + (hours === 1 ? ' hour,' : ' hours,') : ''} ${
      minutes > 0 ? minutes + (minutes === 1 ? ' minute' : ' minutes') : ''
    } ${seconds > 0 ? seconds + (seconds === 1 ? ' second' : ' seconds') : ''}`;
  }

  /**
   * Validates whether or not the profile exists in the database
   * @param {LoginPayload} payload login payload to authenticate with
   * @returns {Promise<any>} registered profile
   */
  async validateUser(payload: any): Promise<any> {
    let user = await this.userService.getUserByEmailAndPassword(payload);
    if (!user) {
      throw new UnauthorizedException(
        'Could not authenticate. Please try again.',
      );
    }
    return user;
  }

  /**
   * Refreshes the jwt token
   * @param {string} refreshToken
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async refreshToken(refreshToken: any): Promise<any> {
    // refresh jwt token
    const token = await this.jwtService.verify(refreshToken, {
      secret: 'refreshTokenSecret',
    });

    // check if token is valid
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    // check if token is expired
    const isExpired = Math.floor(Date.now() / 1000) >= token.exp;

    if (isExpired) {
      throw new UnauthorizedException('Token expired');
    }
  }

  /**
   * Gets the current user
   */
  async getCurrentUser(user): Promise<any> {
    console.log('getCurrentUser user', user);
    let _user = await this.userService.getUserById(user._id);

    if (!_user) {
      throw new UnauthorizedException('User not found');
    }

    return _user;
  }

  async logout(user) {
    try {
      // check role
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('User not found');
    }
  }
}
