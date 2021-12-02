'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TicketFileSchema extends Schema {
  up() {
    this.create('ticket_files', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('ticket_files');
  }
}

module.exports = TicketFileSchema;
