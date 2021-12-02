'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TicketPmSchema extends Schema {
  up() {
    this.create('ticket_pms', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('ticket_pms');
  }
}

module.exports = TicketPmSchema;
