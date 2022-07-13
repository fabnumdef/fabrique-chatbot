import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import * as path from "path";
import { BotLogger } from "../../logger/bot.logger";

@Injectable()
export class MailService {
  private _appDir = '/var/www/fabrique-chatbot-back';
  private readonly _logger = new BotLogger('MailService');

  constructor(private readonly _mailerService: MailerService) {
  }

  /**
   * Send email
   * @param email: Adress to ship the email
   * @param subject: subject of the email
   * @param template: name of the template
   * @param context: context to pass to the template
   * @param attachments
   */
  sendEmail(email: string | string[], subject: string, template: string, context?: any, attachments?: any[]): Promise<any> {
    return this._mailerService
      .sendMail({
        to: email,
        from: `${process.env.MAIL_USER}`,
        subject: subject,
        template: path.resolve(this._appDir, 'templates', template),
        context: context,
        attachments: attachments
      }).then((info) => {
        this._logger.log(`MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`);
      }).catch(error => {
        this._logger.error(`FAIL - MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`, error);
        throw new HttpException('Une erreur est survenue dans l\'envoi du mail.', HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }
}
