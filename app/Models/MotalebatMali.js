'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MotalebatMali extends Model {
  static get table() {
    return 'motalebat_mali';
  }

  Check() {
    return this.hasOne('App/Models/MotalebatCheck', 'province_id', 'id');
  }
}

module.exports = MotalebatMali;
