'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ResidenceFile extends Model {
  static get table() {
    return 'residence_files';
  }
}

module.exports = ResidenceFile;
