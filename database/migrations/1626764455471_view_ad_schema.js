'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ViewAdSchema extends Schema {
  up() {
    this.create('view_ads', (table) => {
      table.increments();
      table.string('user_id');
      table.string('ad_id');
      table.string('text');
      table.string('url');
      table.string('type');
      table.timestamps();
    });
  }

  down() {
    this.drop('view_ads');
  }
}

module.exports = ViewAdSchema;
