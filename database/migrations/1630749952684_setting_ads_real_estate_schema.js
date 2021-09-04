'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SettingAdsRealEstateSchema extends Schema {
  up() {
    this.create('setting_ads_real_estates', (table) => {
      table.increments();
      table.timestamps();
    });
  }

  down() {
    this.drop('setting_ads_real_estates');
  }
}

module.exports = SettingAdsRealEstateSchema;
