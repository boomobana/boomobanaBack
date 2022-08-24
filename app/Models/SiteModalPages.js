'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SiteModalPages extends Model {
  static get table() {
    return 'site_modal_pages';
  }
}

module.exports = SiteModalPages;
