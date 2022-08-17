'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class WalletRequest extends Model {
  static get table() {
    return 'wallet_requests';
  }
}

module.exports = WalletRequest;
