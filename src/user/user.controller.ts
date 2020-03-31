import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserDto } from "@dto/user.dto";
import { User } from "@entity/user.entity";
import camelcaseKeys = require("camelcase-keys");
import { plainToClass } from "class-transformer";
import snakecaseKeys = require("snakecase-keys");
import { UserModel } from "@model/user.model";
import { CreateUserDto } from "@dto/create-user.dto";
import { JwtAuthGuard } from "@guard/jwt.guard";

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {
  }

  @Post('')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'User',
    type: CreateUserDto,
  })
  async create(@Body() user: CreateUserDto): Promise<UserDto> {
    const userModel = await this._userService.create(plainToClass(UserModel, snakecaseKeys(user)));
    return plainToClass(UserDto, camelcaseKeys(userModel, {deep: true}));
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('email') email: string): Promise<void> {
    return this._userService.delete(email);
  }

}
