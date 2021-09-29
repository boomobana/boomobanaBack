'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RealEstateCustomer extends Model {
  user() {
    return this.hasOne('App/Models/User', 'id', 'user_id');
  }
}

module.exports = RealEstateCustomer;
