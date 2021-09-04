'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SettingAdsRealEstateOptionsSchema extends Schema {
  up() {
    this.create('setting_ads_real_estate_options', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('setting_ads_real_estate_options');
  }
}

module.exports = SettingAdsRealEstateOptionsSchema;
