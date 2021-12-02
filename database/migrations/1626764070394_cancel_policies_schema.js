'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CancelPoliciesSchema extends Schema {
  up() {
    this.create('cancel_policies', (table) => {
      table.increments();
      table.string('title');
      table.string('summary');
      table.integer('percent');
      table.string('description');
      table.timestamps();
    });
  }

  down() {
    this.drop('cancel_policies');
  }
}

module.exports = CancelPoliciesSchema;
