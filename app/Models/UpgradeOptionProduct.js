'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class UpgradeOptionProduct extends Model {
  static get table() {
    return 'upgrade_option_product';
  }
}

module.exports = UpgradeOptionProduct;
