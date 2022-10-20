'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BlogPost extends Model {
  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  comment() {
    return this.hasMany('App/Models/BlogComment', 'id', 'post_id').with('userI').with('userA').where('active', 1);
  }

  category() {
    return this.hasMany('App/Models/BlogCategoryPost', 'id', 'post_id').with('category');
  }
}

module.exports = BlogPost;
