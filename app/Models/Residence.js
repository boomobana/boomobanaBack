'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model          = use('Model');
const SeasonDivision = use('App/Models/SeasonDivision');

class Residence extends Model {
  Files() {
    return this.hasMany('App/Models/ResidenceFile');
  }

  favorite() {
    return this.hasMany('App/Models/FavoriteAd', 'id', 'ad_id');
  }

  Option() {
    return this.hasMany('App/Models/ResidenceOptionConnect').with('Option');
  }

  User() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  Answer() {
    return this.hasOne('App/Models/User', 'answer_id', 'id').select([
      'id', 'lastname', 'firstname', 'avatar',
      'is_advisor',
      'is_realestate',
      'is_shobe',
    ]);
  }

  Region() {
    return this.hasOne('App/Models/Region', 'region_id', 'id').select('title', 'id', 'province_id');
  }

  Province() {
    return this.hasOne('App/Models/Province', 'province_id', 'id').select('title', 'id');
  }

  Season() {
    let sd      = [
      { id: 1, start_at: '3/21', end_at: '4/2', middle: '2' },
      { id: 2, start_at: '4/3', end_at: '9/22', middle: '1' },
      { id: 3, start_at: '4/3', end_at: '9/22', middle: '0' },
      { id: 4, start_at: '9/23', end_at: '3/20', middle: '1' },
      { id: 5, start_at: '9/23', end_at: '3/20', middle: '0' },
    ];
    let id      = 1;
    let date    = new Date();
    let month   = date.getMonth() + 1;
    let day     = date.getDay();
    let longday = date.toLocaleString('en-us', { weekday: 'long' });
    let middle  = 1;
    switch (longday.toLowerCase()) {
      case 'wednesday':
      case 'thursday':
      case 'friday':
        middle = 0;
        break;
      default:
        middle = 1;
        break;
    }

    for (let item of sd.filter(e => e.middle == middle)) {
      let d1 = item.start_at.split('/');
      let d2 = item.end_at.split('/');
      let x  = 0;
      if (d1[0] > d2[0])
        x = 1;
      if (date.getMonth() + 1 == '01' || date.getMonth() + 1 == '02' || date.getMonth() + 1 == '12')
        x = 0;
      var from  = new Date(date.getFullYear(), parseInt(d1[0]) - 1, d1[1]);  // -1 because months are from 0 to 11
      var to    = new Date(date.getFullYear() + x, parseInt(d2[0]) - 1, d2[1]);
      var check = new Date(date.getFullYear(), parseInt(month) - 1, day);
      if (check > from && check < to) {
        id = item.id;
      }
    }

    /*for (let item of sd.filter(e => e.middle == 2)) {
      let start = item.start_at.split('/');
      let end   = item.end_at.split('/');
      if (start[0] >= month && end[0] <= month) {
        id = item.id;
      } else if (end[0] <= month && start[0] >= month) {
        id = item.id;
      }
    }*/
    return this.hasMany('App/Models/SeasonConnect', 'id', 'residence_id').where('sd_id', id).select('id').select('sd_id').select('residence_id').select('price').select('description').with('Season');
  }

  Room() {
    return this.hasMany('App/Models/Room');
  }

  Comment() {
    return this.hasMany('App/Models/ResidenceComment', 'id', 'residence_id').where('status', 1).orderBy('id', 'desc').with('User');
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
