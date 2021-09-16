'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SaveRequest extends Model {
  static get table() {
    return 'request_users';
  }
}

module.exports = SaveRequest;
