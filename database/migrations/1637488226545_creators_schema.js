'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CreatorsSchema extends Schema {
  up() {
    this.create('creators', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('creators');
  }
}

module.exports = CreatorsSchema;
