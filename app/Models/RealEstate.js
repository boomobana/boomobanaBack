'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RealEstate extends Model {
  tokens() {
    return this.hasMany('App/Models/TokenRealEstate');
  }
}

module.exports = RealEstate;
