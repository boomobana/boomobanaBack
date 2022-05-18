'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ChatIndex extends Model {
  static get table() {
    return 'chat_index';
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  Chat() {
    return this.hasMany('App/Models/Chat', 'slug', 'slug');
  }

  LChat() {
    return this.hasOne('App/Models/Chat', 'slug', 'slug');
  }
}

module.exports = ChatIndex;
