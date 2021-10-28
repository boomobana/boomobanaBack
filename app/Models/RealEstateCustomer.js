'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RealEstateCustomer extends Model {
  user() {
    return this.hasOne('App/Models/User', 'real_estate_id', 'id');
  }

  region() {
    return this.hasOne('App/Models/Region', 'region_id', 'id');
  }

  province() {
    return this.hasOne('App/Models/Province', 'province_id', 'id');
  }
}

module.exports = RealEstateCustomer;
