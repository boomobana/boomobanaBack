'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PackageBuySchema extends Schema {
  up() {
    this.create('package_buys', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('package_buys');
  }
}

module.exports = PackageBuySchema;
