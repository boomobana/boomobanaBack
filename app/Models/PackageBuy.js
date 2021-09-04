'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class PackageBuy extends Model {
  static get table() {
    return 'package_buys';
  }

  package() {
    return this.hasOne('App/Models/Package', 'package_id', 'id');
  }

  transaction() {
    return this.hasOne('App/Models/Transaction', 'transaction_id', 'id');
  }

}

module.exports = PackageBuy;
