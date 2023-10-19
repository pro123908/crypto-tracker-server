import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Req,
  Headers,
  Delete,
} from '@nestjs/common';

import { AuthService, ITokenReturnBody } from './auth.service';

import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

/**
 * Authentication Controller
 */

@Controller('api/auth')
export class AuthController {
  /**
   * Constructor
   * @param {AuthService} authService authentication service
   * @param {UserService} userService user service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post('login')
  async login(@Body() payload: any): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {RegisterPayload} payload the registration dto
   */
  @Post('register')
  async register(@Body() payload: any): Promise<ITokenReturnBody> {
    const user = await this.userService.create(payload);

    return await this.authService.createToken(user);
  }

  /**
   * Fetches request metadata
   * @param {Req} req the request body
   * @returns {Partial<Request>} the request user populated from the passport module
   */
  @Get('getCurrentUser')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req): Promise<any> {
    return this.authService.getCurrentUser(req.user);
  }

  // Refresh token
  @Get('refreshToken')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Headers('refresh_token') refreshToken: any): Promise<any> {
    console.log('refreshToken', refreshToken);
    return await this.authService.refreshToken(refreshToken);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req): Promise<any> {
    this.authService.logout(req.user);
  }
}
