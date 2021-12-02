'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RealEstateSchema extends Schema {
  up() {
    this.create('real_estates', (table) => {
      table.increments();
      table.string('firstname');
      table.string('lastname');
      table.string('firstname_en');
      table.string('lastname_en');
      table.string('mobile');
      table.string('tell');
      table.string('sos');
      table.string('birthday');
      table.string('male');
      table.string('national_id');
      table.string('bio');
      table.string('about');
      table.string('avatar');
      table.string('logo');
      table.string('email');
      table.string('site_url').comment('آدرس سایت');
      table.string('social_url').comment('آدرس شبکه اجتماعی');
      table.string('economic_code').comment('شماره اقتصادی');
      table.string('registration_number').comment('کد اقتصادی');
      table.string('business_license').comment('شماره ثبت');
      table.string('business_license_number').comment('جواز کسب');
      table.string('postal_code');
      table.string('lat');
      table.string('lng');
      table.string('active').comment('تایید آژانس از طریق مپ');
      table.string('address');
      table.string('statute').comment('اساس نامه');
      table.string('make_residence').comment('ایا می تواند اقامتگاه بسازد؟');
      table.string('shaba_number');
      table.string('card_number');
      table.string('account_owner_name');
      table.timestamps();
    });
  }

  down() {
    this.drop('real_estates');
  }
}

module.exports = RealEstateSchema;
