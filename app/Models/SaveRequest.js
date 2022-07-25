'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SaveRequest extends Model {
  static get table() {
    return 'request_users';
  }

  option() {
    return this.hasMany('App/Models/SaveRequestOption', 'id', 'request_id').with('OptionItem').select([
      'id',
      'request_id',
      'option_id',
    ]);
  }

  RTO2() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'rto_2', 'id').select(['title', 'id']);
  }

  RTO3() {
    return this.hasOne('App/Models/ResidenceTypeOption', 'rto_3', 'id').select(['title', 'id']);
  }
}

module.exports = SaveRequest;
