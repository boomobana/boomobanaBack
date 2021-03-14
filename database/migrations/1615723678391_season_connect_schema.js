'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SeasonConnectSchema extends Schema {
  up() {
    this.create('season_connects', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('season_connects');
  }
}

module.exports = SeasonConnectSchema;
