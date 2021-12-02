'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TokenRealEstateSchema extends Schema {
  up() {
    this.create('token_real_estates', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('token_real_estates');
  }
}

module.exports = TokenRealEstateSchema;
