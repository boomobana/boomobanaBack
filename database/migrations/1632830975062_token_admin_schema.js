'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TokenAdminSchema extends Schema {
  up() {
    this.create('token_admins', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('token_admins');
  }
}

module.exports = TokenAdminSchema;
