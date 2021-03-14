'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */

class UserCode extends Model {
  static get table() {
    return 'user_codes';
  }
}

module.exports = UserCode;
