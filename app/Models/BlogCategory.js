'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class BlogCategory extends Model {
  sub() {
    return this.hasOne('App/Models/BlogCategory', 'sub_cat', 'id');
  }
}

module.exports = BlogCategory;
