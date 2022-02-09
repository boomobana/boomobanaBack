'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BlogCategoryPost extends Model {
  static get table() {
    return 'blog_post_categories';
  }
}

module.exports = BlogCategoryPost;
