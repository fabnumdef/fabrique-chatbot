import { Injectable } from '@nestjs/common';
import { AnsiblePlaybook, Options } from "ansible-playbook-cli-js";
import { BotLogger } from "../logger/bot.logger";

@Injectable()
export class AdminService {
  private readonly _logger = new BotLogger('AdminService');

  // constructor() {
  // }

  async generateIntranetPackage(): Promise<void> {
    const appDir = '/var/www/fabrique-chatbot-back';
    const playbookOptions = new Options(`${appDir}/ansible`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`playUsinegenerateintranet.yml`).then(result => this._logger.log(result));
  }
}
