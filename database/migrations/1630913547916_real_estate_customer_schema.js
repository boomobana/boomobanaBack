'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RealEstateCustomerSchema extends Schema {
  up() {
    this.create('real_estate_customers', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('real_estate_customers');
  }
}

module.exports = RealEstateCustomerSchema;
