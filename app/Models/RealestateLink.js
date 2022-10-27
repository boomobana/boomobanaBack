'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RealestateLink extends Model {
  static get table() {
    return 'realestate_link';
  }

  Residence() {
    return this.hasOne('App/Models/Residence', 'post_id', 'id');
  }

  Request() {
    return this.hasOne('App/Models/SaveRequest', 'post_id', 'id');
  }
}

module.exports = RealestateLink;
