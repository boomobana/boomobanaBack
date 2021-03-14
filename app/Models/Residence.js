'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Residence extends Model {
  Files() {
    return this.hasMany('App/Model/ResidenceFile', 'residence_id', 'id');
  }

  Option() {
    return this.hasMany('App/Model/ResidenceOptionConnect', 'residence_id', 'id').with('Option');
  }
}

module.exports = Residence;
