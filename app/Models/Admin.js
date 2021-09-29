'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Admin extends Model {

  tokens() {
    return this.hasMany('App/Models/TokenAdmin');
  }
}

module.exports = Admin;
