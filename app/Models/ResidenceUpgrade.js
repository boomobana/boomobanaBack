'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class UpgradeOption extends Model {
  static get table() {
    return 'residence_upgrade';
  }
}

module.exports = UpgradeOption;
