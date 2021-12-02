'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SeasonDivisionSchema extends Schema {
  up() {
    this.create('season_divisions', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('season_divisions');
  }
}

module.exports = SeasonDivisionSchema;
