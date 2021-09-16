'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SaveRequestSchema extends Schema {
  up() {
    this.create('save_requests', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('save_requests');
  }
}

module.exports = SaveRequestSchema;
