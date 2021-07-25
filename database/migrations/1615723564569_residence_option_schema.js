'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceOptionSchema extends Schema {
  up() {
    this.create('residence_options', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('residence_options');
  }
}

module.exports = ResidenceOptionSchema;
