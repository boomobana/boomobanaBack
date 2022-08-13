'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model          = use('Model');
const SeasonDivision = use('App/Models/SeasonDivision');

class ResidenceComment extends Model {
  static get table() {
    return 'blog_post_comment';
  }
}

module.exports = ResidenceComment;
