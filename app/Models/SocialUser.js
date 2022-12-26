'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SocialUser extends Model {
  static get table() {
    return 'social_user';
  }
}

module.exports = SocialUser;
