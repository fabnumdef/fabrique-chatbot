import { Injectable } from '@nestjs/common';
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

  findOne(email: string, password?: string): Promise<User> {
    if (!!password) {
      return this._usersRepository.findOne({where: {email: email, password: password}});
    }
    return this._usersRepository.findOne({where: {email: email}});
  }

  create(user: UserModel): Promise<UserModel> {
    return this._usersRepository.save(user);
  }

  async delete(email: string): Promise<void> {
    await this._usersRepository.delete(email);
  }

}
