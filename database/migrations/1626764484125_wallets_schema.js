'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WalletsSchema extends Schema {
  up() {
    this.create('wallets', (table) => {
      table.increments();
      table.string('user_id');
      table.string('available');
      table.string('past_amount');
      table.string('cost');
      table.string('type_payment');
      table.string('red_id1');
      table.string('red_id2');
      table.string('payment_code');
      table.string('slug');
      table.timestamps();
    });
  }

  down() {
    this.drop('wallets');
  }
}

module.exports = WalletsSchema;
