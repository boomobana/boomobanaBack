'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BlogComment extends Model {
  static get table() {
    return 'blog_post_comment';
  }

  userI() {
    return this.hasOne('App/Models/User', 'user_posted', 'id');
  }

  userA() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

}

module.exports = BlogComment;
