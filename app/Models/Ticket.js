'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Ticket extends Model {
  static get table() {
    return 'tickets';
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  realEstate() {
    return this.hasOne('App/Models/RealEstate', 'user_id', 'id');
  }
}

module.exports = Ticket;
