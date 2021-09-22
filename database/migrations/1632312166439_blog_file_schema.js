'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BlogFileSchema extends Schema {
  up() {
    this.create('blog_files', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('blog_files');
  }
}

module.exports = BlogFileSchema;
