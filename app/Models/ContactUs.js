'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ContactUs extends Model {
  static get table() {
    return 'contact_us';
  }
}

module.exports = ContactUs;
