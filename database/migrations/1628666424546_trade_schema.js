'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TradeSchema extends Schema {
  up() {
    this.create('trades', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('trades');
  }
}

module.exports = TradeSchema;
