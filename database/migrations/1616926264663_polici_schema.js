'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PoliciSchema extends Schema {
  up() {
    this.create('policis', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('policis');
  }
}

module.exports = PoliciSchema;
