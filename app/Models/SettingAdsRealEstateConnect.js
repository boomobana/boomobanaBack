'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SettingAdsRealEstateConnect extends Model {
  static get table() {
    return 'setting_ads_real_estate_residence_connections';
  }

  residence() {
    return this.hasOne('App/Models/Residence', 'residence_id', 'id').with('RTO1').with('RTO2').with('RTO3').with('User').with('Region').with('Province');
  }

}

module.exports = SettingAdsRealEstateConnect;
