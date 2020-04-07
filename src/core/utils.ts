/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @param curDir {string}
 * @return {Promise<string>}
 */
export function execShellCommand(cmd, curDir?: string) {
  const execOptions = {
    cwd: curDir,
    env: {
      DEBUG: '',
      HOME: process.env.HOME,
      PATH: process.env.PATH,
    }
  };
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, execOptions, (error, stdout, stderr) => {
      resolve(stdout? stdout : stderr);
    });
  });
}

export function jsonToDotenv(json: any): string {
  let dotenv = '';
  for (const property in json) {
    dotenv += `${property}=${json[property]}\n`;
  }
  return dotenv;
}
