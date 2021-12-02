'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceOptionConnectSchema extends Schema {
  up() {
    this.create('residence_option_connects', (table) => {
      table.increments();
      table.integer('residence_id').nullable().default(0);
      table.integer('residence_option_id').nullable().default(0);
      table.string('description').nullable().default(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('residence_option_connects');
  }
}

module.exports = ResidenceOptionConnectSchema;
