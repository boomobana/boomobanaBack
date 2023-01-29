'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class StaticPages extends Model {
  static get table() {
    return 'static_pages';
  }

  according() {
    return this.hasMany('App/Models/StaticPagesAccordion', 'id', 'site_id');
  }
}

module.exports = StaticPages;
