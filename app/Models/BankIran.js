'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BankIran extends Model {
  static get table() {
    return 'bank_iran';
  }
}

module.exports = BankIran;
