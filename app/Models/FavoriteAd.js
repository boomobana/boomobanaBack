'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model     = use('Model');
const Residence = use('./Residence');

class FavoriteAd extends Model {
  static get table() {
    return 'favorit_ads';
  }

  Residence() {
    return this.hasOne('App/Models/Residence', 'ad_id', 'id').with('Answer').with('User').with('User').with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season');
  }
}

module.exports = FavoriteAd;
