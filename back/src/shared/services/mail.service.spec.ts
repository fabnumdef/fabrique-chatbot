import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from "@nestjs-modules/mailer";

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;
  let mailerServiceStub = {
    sendMail: (options: any) => new Promise<any>(() => {
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {provide: 'MailerService', useValue: mailerServiceStub}
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should call mailer service on send mail with the rights values', () => {
    process.env.MAIL_USER = 'batman@gotham.fr';
    jest.spyOn(mailerService, 'sendMail');
    mailService.sendEmail('police@gotham.fr', 'Batmobile volée', 'batmobile-steal', {suspect: 'Robin'}).then();

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'police@gotham.fr',
      from: 'batman@gotham.fr',
      subject: 'Batmobile volée',
      template: 'batmobile-steal',
      context: {suspect: 'Robin'},
    });
  });

  it('should log call to mail server', async () => {
    jest.spyOn(mailerService, 'sendMail').mockResolvedValue(true);
    jest.spyOn(console, 'log');
    await mailService.sendEmail('police@gotham.fr', 'Batmobile volée', 'batmobile-steal', {suspect: 'Robin'}).then();

    expect(console.log).toHaveBeenCalled();
  });

  it('should log error if call crash', async () => {
    jest.spyOn(mailerService, 'sendMail').mockRejectedValue(true);
    jest.spyOn(console, 'error');

    await expect(mailService.sendEmail('police@gotham.fr', 'Batmobile volée', 'batmobile-steal', {suspect: 'Robin'}).then()).rejects.toBeTruthy();
    expect(console.error).toHaveBeenCalled();
  });
});
