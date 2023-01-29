'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class StaticPagesAccordion extends Model {
  static get table() {
    return 'static_pages_accordion';
  }
}

module.exports = StaticPagesAccordion;
