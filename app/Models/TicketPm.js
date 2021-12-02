'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TicketPm extends Model {
  static get table() {
    return 'ticket_pm';
  }

  files() {
    return this.hasMany('App/Models/TicketFile', 'id', 'ticket_pm_id');
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id').select(['id', 'firstname', 'lastname']);
  }
}

module.exports = TicketPm;
