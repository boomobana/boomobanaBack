'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MoamelatUser extends Model {
  Region() {
    return this.hasOne('App/Models/Region', 'region_id', 'id');

  }

  Province() {
    return this.hasOne('App/Models/Province', 'province_id', 'id');

  }
}

module.exports = MoamelatUser;
