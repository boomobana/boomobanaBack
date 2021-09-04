'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SettingAdsRealEstateConnectSchema extends Schema {
  up() {
    this.create('setting_ads_real_estate_connects', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('setting_ads_real_estate_connects');
  }
}

module.exports = SettingAdsRealEstateConnectSchema;
