import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserDto } from "@dto/user.dto";
import { User } from "@entity/user.entity";
import { plainToClass } from "class-transformer";
import { UserModel } from "@model/user.model";
import { CreateUserDto } from "@dto/create-user.dto";
import { UpdateUserDto } from "@dto/update-user.dto";
import { UserRole } from "@enum/user-role.enum";
import camelcaseKeys = require("camelcase-keys");
import snakecaseKeys = require("snakecase-keys");
import { JwtAuthGuard } from "@guard/jwt.guard";

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {
  }

  @Post('')
  @ApiOperation({summary: 'Create user'})
  @ApiBody({
    description: 'User',
    type: CreateUserDto,
  })
  async create(@Body() user: CreateUserDto): Promise<UserDto> {
    const userModel = await this._userService.create(plainToClass(UserModel, snakecaseKeys(user)));
    return plainToClass(UserDto, camelcaseKeys(userModel, {deep: true}));
  }

  @Put(':email')
  @ApiOperation({summary: 'Update user'})
  @ApiBody({
    description: 'User',
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param('email') userEmail: string,
               @Body() user: UpdateUserDto,
               @Req() req): Promise<UserDto> {
    const userRequest: UserDto = req.user;
    if (userRequest.role !== UserRole.admin && userRequest.email !== userEmail) {
      throw new HttpException(`Vous n'avez pas le droit de modifier un autre utilisateur.`, HttpStatus.FORBIDDEN);
    }
    if (userRequest.role !== UserRole.admin) {
      delete user.role;
    }
    const userModel = await this._userService.findAndUpdate(userEmail, plainToClass(UserModel, snakecaseKeys(user)));
    return plainToClass(UserDto, camelcaseKeys(userModel, {deep: true}));
  }
}
