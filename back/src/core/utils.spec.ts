import { execShellCommand, jsonToDotenv } from "@core/utils";

describe('Utils Validator', () => {

  it('should exec shell command', async () => {
    expect(await execShellCommand('ls').then()).toBeTruthy();
  });

  it('convert json to .env format', () => {
    const json = {
      name: 'Bruce',
      role: 'Batman'
    };

    const dotenv = jsonToDotenv(json);
    expect(dotenv).toEqual(`name=Bruce\nrole=Batman\n`)
  });
})
