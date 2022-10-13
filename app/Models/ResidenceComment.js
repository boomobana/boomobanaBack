'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ResidenceComment extends Model {
  static get table() {
    return 'residence_comments';
  }

  User() {
    return this.hasOne('App/Models/User', 'user_id', 'id').select('id', 'firstname', 'lastname');
  }
}

module.exports = ResidenceComment;
