'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BankAddressSchema extends Schema {
  up() {
    this.create('bank_addresses', (table) => {
      table.increments();
      table.integer('user_id');
      table.string('card_number');
      table.string('shaba_number');
      table.string('account_owner_name');
      table.string('emergency_contact_number');
      table.string('phone_number');
      table.string('bank_name');
      table.string('national_card');
      table.string('id_card');
      table.string('business_license');
      table.string('shomare_sabt');
      table.string('economic_code');
      table.string('postal_code');
      table.string('other_document');
      table.string('address');
      table.string('lat');
      table.string('lng');
      table.timestamps();
    });
  }

  down() {
    this.drop('bank_addresses');
  }
}

module.exports = BankAddressSchema;
