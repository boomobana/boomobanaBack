'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FavoriteAdSchema extends Schema {
  up() {
    this.create('favorite_ads', (table) => {
      table.increments();
      table.integer('ad_id');
      table.integer('user_id');
      table.timestamps();
    });
  }

  down() {
    this.drop('favorite_ads');
  }
}

module.exports = FavoriteAdSchema;
