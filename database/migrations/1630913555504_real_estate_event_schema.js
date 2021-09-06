'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RealEstateEventSchema extends Schema {
  up() {
    this.create('real_estate_events', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('real_estate_events');
  }
}

module.exports = RealEstateEventSchema;
