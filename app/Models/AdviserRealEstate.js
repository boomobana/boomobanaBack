'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class AdviserRealEstate extends Model {
  Advisor() {
    return this.hasOne('App/Models/Adviser', 'adviser_id', 'id');
  }

  Realestate() {
    return this.hasOne('App/Models/User', 'real_estate_id', 'id');
  }
}

module.exports = AdviserRealEstate;
