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

  RTO_2() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'type_customer', 'id').select('title', 'id');
  }

  RTO_3() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'type_melk', 'id').select('title', 'id');
  }
}

module.exports = RealEstateCustomer;
