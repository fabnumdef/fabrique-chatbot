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
   * @param attachments
   */
  sendEmail(email: string, subject: string, template: string, context?: any, attachments?: any[]): Promise<any> {
    return this._mailerService
      .sendMail({
        to: email,
        from: `${process.env.MAIL_USER}`,
        subject: subject,
        template: template,
        context: context,
        attachments: attachments
      }).then((info) => {
        console.log(`${new Date().toLocaleString()} - MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`);
      }).catch(() => {
        console.error(`${new Date().toLocaleString()} - FAIL - MAIL SEND TO: ${email} WITH SUBJECT: ${subject} WITH TEMPLATE: ${template} AND CONTEXT: ${JSON.stringify(context)}`);
        throw new HttpException('Une erreur est survenue dans l\'envoi du mail.', HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }
}
