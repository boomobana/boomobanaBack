'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MotalebatCheck extends Model {
  static get table() {
    return 'motalebat_check';
  }
}

module.exports = MotalebatCheck;
