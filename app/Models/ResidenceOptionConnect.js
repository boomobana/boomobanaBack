'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ResidenceOptionConnect extends Model {
  Option() {
    return this.hasOne('App/Models/ResidenceOption', 'residence_option_id', 'id').select('id', 'title', 'type', 'images');
  }
}

module.exports = ResidenceOptionConnect;
