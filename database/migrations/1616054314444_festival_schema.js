'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FestivalSchema extends Schema {
  up() {
    this.create('festivals', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('festivals');
  }
}

module.exports = FestivalSchema;
