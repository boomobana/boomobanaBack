'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SaveRequestRealestate extends Model {
  static get table() {
    return 'request_users_realestate';
  }
}

module.exports = SaveRequestRealestate;
