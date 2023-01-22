'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Resaneha extends Model {
  static get table() {
    return 'resaneha';
  }
}

module.exports = Resaneha;
