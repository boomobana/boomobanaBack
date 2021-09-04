'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SettingAdsRealEstateOption extends Model {
  static get table() {
    return 'setting_ads_real_estate_options';
  }

  Option() {
    return this.hasOne('App/Models/ResidenceOption', 'option_id', 'id');
  }
}

module.exports = SettingAdsRealEstateOption;
