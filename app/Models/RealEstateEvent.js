'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RealEstateEvent extends Model {
  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id').select(['id', 'firstname', 'lastname']);
  }
}

module.exports = RealEstateEvent;
