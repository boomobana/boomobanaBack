'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BlogPostsSchema extends Schema {
  up() {
    this.create('blog_posts', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('blog_posts');
  }
}

module.exports = BlogPostsSchema;
