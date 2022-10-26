'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class UpgradeOption extends Model {
  static get table() {
    return 'upgrade_option';
  }

  products() {
    return this.hasMany('App/Models/UpgradeOptionProduct', 'id', 'product_id');
  }
}

module.exports = UpgradeOption;
