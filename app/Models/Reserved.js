'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Reserved extends Model {
  Residence() {
    return this.hasOne('App/Models/Residence', 'residence_id', 'id').with('User').with('User').with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season');
  }
}

module.exports = Reserved;
