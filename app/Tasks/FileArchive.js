'use strict';

const Task      = use('Task');
const Residence = use('App/Models/Residence');
const Database  = use('Database');
const Env       = use('Env');

class FileArchive extends Task {
  static get schedule() {
    return '0 0 */1 * * *';
  }

  async handle() {
    if (Env.get('NODE_ENV') === 'production') {
      console.log('Cron Job Running');
      let data = await Residence.query().where('archive', 0).fetch();
      for (let row of data.rows) {
        let timeStmp   = new Date(row.updated_at).getTime();
        let nowTime    = new Date().getTime();
        let dayChanged = ((nowTime - timeStmp) / 60 / 60 / 24) / 1000;
        if (dayChanged > 45) {
          row.archive = 1;
        }
        if (row.different != 0) {
          if (row.different < nowTime) {
            row.different = 0;
          }
        }
        if (row.instantaneous != 0) {
          if (row.instantaneous < nowTime) {
            row.instantaneous = 0;
          }
        }
        if (row.occasion != 0) {
          if (row.occasion < nowTime) {
            row.occasion = 0;
          }
        }
        if (row.Special != 0) {
          if (row.Special < nowTime) {
            row.Special = 0;
          }
        }
        row.save();
      }
      await Database.raw(`UPDATE tickets set status = '3' WHERE updated_at <= NOW() - INTERVAL 3 DAY`);
    }
  }
}

module.exports = FileArchive;
