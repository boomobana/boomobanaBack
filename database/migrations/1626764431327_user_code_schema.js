'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserCodeSchema extends Schema {
  up() {
    this.create('user_codes', (table) => {
      table.increments();
      table.string('firstname');
      table.string('lastname');
      table.string('mobile');
      table.string('password');
      table.string('code');
      table.string('used');
      table.string('type');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_codes');
  }
}

module.exports = UserCodeSchema;
