'use strict';

const Task      = use('Task');
const Residence = use('App/Models/Residence');

class FileArchive extends Task {
  static get schedule() {
    return '0 0 */1 * * *';
  }

  async handle() {
    let data = await Residence.query().where('archive', 0).fetch();
    for (let row of data.rows) {
      let timeStmp   = new Date(row.updated_at).getTime();
      let nowTime    = new Date().getTime();
      let dayChanged = ((nowTime - timeStmp) / 60 / 60 / 24) / 1000;
      if (dayChanged > 45) {
        row.archive = 1;
        row.save();
      }
    }
    console.log('Cron Job Running');
  }
}

module.exports = FileArchive;
