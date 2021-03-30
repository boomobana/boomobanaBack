'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SeasonConnect extends Model {
  Season() {
    return this.hasOne('App/Models/SeasonDivision', 'sd_id', 'id').select('id').select('title').select('middle').select('start_at').select('end_at').select('description');
  }
}

module.exports = SeasonConnect;
