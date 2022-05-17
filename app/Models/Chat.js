'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Chat extends Model {
  static get table() {
    return 'chat';
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }
}

module.exports = Chat;
