'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Trade extends Model {
  Transaction() {
    return this.hasOne('App/Models/Transaction', 'transaction_id', 'id');
  }

  Residence() {
    return this.hasOne('App/Models/Residence', 'residence_id', 'id').with(['Region']).with(['Province']);
  }

  RealEstate() {
    return this.hasOne('App/Models/RealEstate', 'real_estate_id', 'id');
  }

  User() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }
}

module.exports = Trade;
