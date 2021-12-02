'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Ticket extends Model {
  static get table() {
    return 'tickets';
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id').select(['id', 'firstname', 'lastname']);
  }

  pm() {
    return this.hasMany('App/Models/TicketPm', 'id', 'ticket_id').orderBy('id', 'desc').with('user').with('files');
  }
}

module.exports = Ticket;
