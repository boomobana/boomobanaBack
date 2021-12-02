'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ResidenceSchema extends Schema {
  up() {
    this.create('residences', (table) => {
      table.increments();
      table.integer('user_id').nullable().default(0);
      table.string('title').nullable().default(0);
      table.string('type').comment('1 residence 2 rahn 3 long').nullable().default(0);
      table.string('postal_code').nullable().default(0);
      table.string('real_address').nullable().default(0);
      table.string('description').nullable().default(0);
      table.string('description_room').nullable().default(0);
      table.string('capacity').nullable().default(0);
      table.string('capacity_standard').nullable().default(0);
      table.string('rto_1').comment('table residence option').nullable().default(0);
      table.string('rto_2').comment('table residence option').nullable().default(0);
      table.string('rto_3').comment('table residence option').nullable().default(0);
      table.string('count_roilet').nullable().default(0);
      table.string('count_bathroom').nullable().default(0);
      table.string('floor_area').comment('متراژ زیر بنا').nullable().default(0);
      table.string('all_area').comment('متراژ کل').nullable().default(0);
      table.string('province_id').nullable().default(0);
      table.string('region_id').nullable().default(0);
      table.string('before_reserve').comment('چند روز قبل خبر دهی شود').nullable().default(0);
      table.string('start_delivery').nullable().default(0);
      table.string('end_delivery').nullable().default(0);
      table.string('discharge').nullable().default(0);
      table.string('after_reserve').comment('چند ماه بعد رزرو کنند').nullable().default(0);
      table.string('min_reserve').comment('حداقل روز').nullable().default(0);
      table.string('max_reserve').comment('حداکثر روز').nullable().default(0);
      table.string('price_max_man').comment('نرخ نفر اضافه').nullable().default(0);
      table.string('week_discount').nullable().default(0);
      table.string('month_discount').nullable().default(0);
      table.string('other_rules').nullable().default(0);
      table.string('cancel_policy_id').nullable().default(0);
      table.string('sign_calendar').nullable().default(0);
      table.string('sign_rules_site').nullable().default(0);
      table.string('lat').comment('لوکیشن').nullable().default(0);
      table.string('lng').comment('لوکیشن').nullable().default(0);
      table.string('status').comment('0 تکمیل نشده 1 در انتظار تایید 2 تایید شده').nullable().default(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('residences');
  }
}

module.exports = ResidenceSchema;
