import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() payload: any) {
    return this.userService.create(payload);
  }

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
