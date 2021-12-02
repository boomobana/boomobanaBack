'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReservedSchema extends Schema {
  up() {
    this.create('reserveds', (table) => {
      table.increments();
      table.integer('user_id');
      table.timestamps();
    });
  }

  down() {
    this.drop('reserveds');
  }
}

module.exports = ReservedSchema;
