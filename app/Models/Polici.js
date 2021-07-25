'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Polici extends Model {
  static get table() {
    return 'cancel_policies';
  }
}

module.exports = Polici;
