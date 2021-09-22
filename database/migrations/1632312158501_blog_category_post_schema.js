'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BlogCategoryPostSchema extends Schema {
  up() {
    this.create('blog_category_posts', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('blog_category_posts');
  }
}

module.exports = BlogCategoryPostSchema;
