import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { ResetPasswordDto } from "@dto/reset-password.dto";
import { MoreThan } from "typeorm";
import { LoginUserDto } from "@dto/login-user.dto";
import { AuthResponseDto } from "@dto/auth-response.dto";
import { JwtService } from "@nestjs/jwt";

const crypto = require('crypto');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(private readonly _userService: UserService,
              private readonly _mailerService: MailerService,
              private readonly _jwtService: JwtService) {
  }

  async login(user: LoginUserDto): Promise<AuthResponseDto> {
    const userToReturn = await this.validateUser(user);
    if (userToReturn) {
      return {
        chatbotFactoryToken: this._jwtService.sign(JSON.parse(JSON.stringify(userToReturn))),
        user: userToReturn
      };
    }
    return null;
  }

  async sendEmailPasswordToken(email: string, newUser: boolean = false) {
    const userWithoutPassword = await this._userService.findOne(email);
    if (!userWithoutPassword) {
      return;
    }
    // create the random token
    const tokenLength = 64;
    const token = crypto
      .randomBytes(Math.ceil((tokenLength * 3) / 4))
      .toString('base64') // convert to base64 format
      .slice(0, tokenLength) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'

    const valuesToUpdate = {
      reset_password_token: token,
      reset_password_expires: new Date((Date.now() + 86400000))
    };
    const userUpdated = await this._userService.findAndUpdate(email, valuesToUpdate);

    await this._mailerService
      .sendMail({
        to: userUpdated.email,
        from: `${process.env.MAIL_USER}`,
        subject: newUser ? 'Fabrique à Chatbots - Création de compte' : 'Fabrique à Chatbots - Réinitialisation de mot de passe',
        template: newUser ? 'create-account' : 'forgot-password',
        context: {  // Data to be sent to template engine.
          firstName: userUpdated.first_name,
          url: `${process.env.HOST_URL}/auth/reset-password?token=${userUpdated.reset_password_token}`
        },
      })
      .then(() => {})
      .catch(() => {
        throw new HttpException('Une erreur est survenue dans l\'envoi du mail.', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const userWithoutPassword = await this._userService.findOneWithParam({
      reset_password_token: resetPassword.token,
      reset_password_expires: MoreThan(new Date())
    });
    if (!userWithoutPassword) {
      throw new HttpException('Cet utilisateur n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const hashPassword = bcrypt.hashSync(resetPassword.password, this.saltRounds);
    const valuesToUpdate = {
      password: hashPassword,
      reset_password_token: undefined,
      reset_password_expires: undefined
    };
    const userUpdated = await this._userService.findAndUpdate(userWithoutPassword.email, valuesToUpdate);

    await this._mailerService
      .sendMail({
        to: userUpdated.email,
        from: `${process.env.MAIL_USER}`,
        subject: 'Fabrique à Chatbots - Mot de passe modifié',
        template: 'reset-password',
        context: {  // Data to be sent to template engine.
          firstName: userUpdated.first_name,
          url: `${process.env.HOST_URL}/auth/login`
        },
      })
      .then(() => {})
      .catch(() => {
        throw new HttpException('Une erreur est survenue dans l\'envoi du mail.', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private async validateUser(user: LoginUserDto): Promise<any> {
    const userToReturn = await this._userService.findOne(user.email, true);
    if (userToReturn && bcrypt.compareSync(user.password, userToReturn.password)) {
      const {password, ...result} = userToReturn;
      return result;
    }
    throw new HttpException('Mauvais identifiant ou mot de passe.',
      HttpStatus.UNAUTHORIZED);
  }
}
