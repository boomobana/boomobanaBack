'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Social extends Model {
  static get table() {
    return 'social';
  }
}

module.exports = Social;
