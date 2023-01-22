'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RequestUsersRealestate extends Model {
  static get table() {
    return 'request_users_realestate';
  }

  User() {
    return this.hasOne('App/Models/User', 'id', 'user_id');
  }

  RequestUser() {
    return this.hasOne('App/Models/SaveRequest', 'id', 'request_id');
  }

}

module.exports = RequestUsersRealestate;
