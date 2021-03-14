'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceOptionConnectSchema extends Schema {
  up() {
    this.create('residence_option_connects', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('residence_option_connects');
  }
}

module.exports = ResidenceOptionConnectSchema;
