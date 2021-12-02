'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TicketFile extends Model {
  static get table() {
    return 'ticket_files';
  }
}

module.exports = TicketFile;
