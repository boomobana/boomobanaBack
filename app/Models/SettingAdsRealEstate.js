'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SettingAdsRealEstate extends Model {
  static get table() {
    return 'setting_ads_real_estates';
  }

  options() {
    return this.hasMany('App/Models/SettingAdsRealEstateOption', 'id', 'setting_id').with('Option');
  }
}

module.exports = SettingAdsRealEstate;
