import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entity/user.entity";
import { UserModel } from "@model/user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this._usersRepository.find();
  }

  findOne(email: string, password: boolean = false): Promise<User> {
    if (!password) {
      return this._usersRepository.findOne({where: {email: email}});
    }
    return this._usersRepository.findOne({
        select: ['email', 'password', 'first_name', 'last_name', 'chatbot_theme', 'role'],
        where: {email: email}
    });
  }

  findOneWithParam(param: any): Promise<User> {
    return this._usersRepository.findOne(param);
  }

  async create(user: UserModel): Promise<UserModel> {
    const userExists = await this.findOne(user.email);
    if(!userExists) {
      return this._usersRepository.save(user);
    }
    throw new HttpException('Un utilisateur avec cet email existe déjà.', HttpStatus.FORBIDDEN);
  }

  async findAndUpdate(email: string, data: any): Promise<User> {
    const userExists = await this.findOne(email);
    if(!userExists) {
      throw new HttpException('Cet utilisateur n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this._usersRepository.save({
      ...userExists,
      ...data
    });
  }

  async delete(email: string): Promise<void> {
    await this._usersRepository.delete(email);
  }

}
