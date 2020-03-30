import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly _mailerService: MailerService) {
  }

  /**
   * Send email
   * @param email: Adress to ship the email
   * @param subject: subject of the email
   * @param template: name of the template
   * @param context: context to pass to the template
   */
  sendEmail(email: string, subject: string, template: string, context?: any): Promise<any> {
    return this._mailerService
      .sendMail({
        to: email,
        from: `${process.env.MAIL_USER}`,
        subject: subject,
        template: template,
        context: context,
      }).then(() => {
        console.log(`MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`);
      }).catch(() => {
        console.error(`FAIL - MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`);
        throw new HttpException('Une erreur est survenue dans l\'envoi du mail.', HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }
}
