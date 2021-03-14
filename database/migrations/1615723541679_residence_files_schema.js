'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceFilesSchema extends Schema {
  up() {
    this.create('residence_files', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('residence_files');
  }
}

module.exports = ResidenceFilesSchema;
