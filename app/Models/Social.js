'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Social extends Model {
  static get table() {
    return 'social';
  }

  SocialUser() {
    return this.hasOne('App/Models/SocialUser', 'id', 'social_id');//.select(['id', 'firstname', 'lastname', 'mobile']);
  }
}

module.exports = Social;
