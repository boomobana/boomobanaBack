'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceTypeOptionSchema extends Schema {
  up() {
    this.create('residence_type_options', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('residence_type_options');
  }
}

module.exports = ResidenceTypeOptionSchema;
