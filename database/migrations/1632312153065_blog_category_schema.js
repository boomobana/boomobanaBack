'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BlogCategorySchema extends Schema {
  up() {
    this.create('blog_categories', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('blog_categories');
  }
}

module.exports = BlogCategorySchema;
