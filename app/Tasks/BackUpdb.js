'use strict';

const fs       = require('fs');
const Task     = use('Task');
const Database = use('Database');
const Env      = use('Env');
const driver   = use('Drive');
const exec     = require('child_process').exec;

class BackUpdb extends Task {
  static get schedule() {
    return '0 0 23 * * *';
  }

  async handle() {
    if (Env.get('NODE_ENV') === 'production') {
      console.log('Backup Data');
      let child = exec(`mysqldump -u root -p${Env.get('DB_PASSWORD')} ${Env.get('DB_DATABASE')} > dumpfilename.sql`);
      let dir   = Env.get('FTP_DIR_BACKUP');
      setTimeout(async () => {
        let data = Buffer.from(await fs.readFileSync(__dirname + '/../../dumpfilename.sql'));
        let dt   = new Date();
        let name = dt.getMonth() + '-' + dt.getDay() + '.sql';
        await driver.put(dir + name, data);
        await fs.rmSync(__dirname + '/../../dumpfilename.sql');
        console.log('End Backup Data');
      }, 10 * 1000);
    }
  }
}

module.exports = BackUpdb;
