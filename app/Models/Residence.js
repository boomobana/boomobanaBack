'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model          = use('Model');
const SeasonDivision = use('App/Models/SeasonDivision');

class Residence extends Model {
  Files() {
    return this.hasMany('App/Models/ResidenceFile');
  }

  Option() {
    return this.hasMany('App/Models/ResidenceOptionConnect').with('Option');
  }

  User() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  Region() {
    return this.hasOne('App/Models/Region', 'region_id', 'id').select('title', 'id', 'province_id');
  }

  Province() {
    return this.hasOne('App/Models/Province', 'province_id', 'id').select('title', 'id');
  }

  Season() {
    let sd    = [
      { id: 1, start_at: '3/21', end_at: '4/2', middle: '2' },
      { id: 2, start_at: '4/3', end_at: '9/22', middle: '1' },
      { id: 3, start_at: '4/3', end_at: '9/22', middle: '1' },
      { id: 4, start_at: '9/23', end_at: '3/20', middle: '1' },
      { id: 5, start_at: '9/23', end_at: '3/20', middle: '0' },
    ];
    let id    = 1;
    let date  = new Date();
    let month = date.getMonth();
    month     = 3;
    let day   = date.getDay();
    sd.forEach(item => {
      let start = item.start_at.split('/');
      let end   = item.end_at.split('/');
      // console.log(item, start, end);
      if (start[0] >= month && end[0] <= month) {
        // console.log('eyd 2', month);
        id = item.id;
      } else if (end[0] <= month && start[0] >= month) {
        // console.log('eyd 1', month);
        id = item.id;
      }
      // switch (item) {
      //
      // }
    });
    return this.hasOne('App/Models/SeasonConnect', 'id', 'residence_id').where('sd_id', id).select('id').select('sd_id').select('residence_id').select('price').select('description').with('Season');
  }

  Room() {
    return this.hasMany('App/Models/Room');
  }

  RTO1() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'rto_1', 'id').select('title', 'id');
  }

  RTO2() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'rto_2', 'id').select('title', 'id');
  }

  RTO3() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'rto_3', 'id').select('title', 'id');
  }
}

module.exports = Residence;
