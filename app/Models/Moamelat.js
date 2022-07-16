'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Moamelat extends Model {
  Side1() {
    return this.hasOne('App/Models/MoamelatUser', 'side_1', 'id');
  }

  Side2() {
    return this.hasOne('App/Models/MoamelatUser', 'side_2', 'id');
  }

  Adviser() {
    return this.hasOne('App/Models/MoamelatAdviser', 'adviser_id', 'id');
  }

  User() {
    return this.hasOne('App/Models/User', 'realestate_id', 'id');
  }

}

module.exports = Moamelat;
