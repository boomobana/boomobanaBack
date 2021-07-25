'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ResidenceTypeOption extends Model {
  static get table() {
    return 'residence_type_options';
  }
}

module.exports = ResidenceTypeOption;
