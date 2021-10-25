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
    const extraVars = {
      frontBranch: 'master',
      backBranch: 'master',
      botBranch: 'master'
    };
    await ansiblePlaybook.command(`playUsineupdaterepos.yml --vault-id dev@password_file -e '${JSON.stringify(extraVars)}'`).then((result) => {
      this._logger.log(`UPDATING CHATBOTS REPOSITORIES`);
      this._logger.log(result);
    }).catch(err => {
      this._logger.error(`ERRROR UPDATING CHATBOTS REPOSITORIES`, err);
    });
    await ansiblePlaybook.command(`playUsinegenerateintranet.yml --vault-id dev@password_file`).then(result => {
      this._logger.log(`GENERATING INTRANET PACKAGE`);
      this._logger.log(result)
    }).catch(err => {
      this._logger.error(`ERRROR GENERATING INTRANET PACKAGE`, err);
    });
  }
}
