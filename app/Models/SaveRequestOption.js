'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SaveRequestOption extends Model {
  static get table() {
    return 'request_users_option';
  }

  //
  OptionItem() {
    return this.hasOne('App/Models/ResidenceOption', 'option_id', 'id').select(['id', 'title', 'images', 'type']);
  }

}

module.exports = SaveRequestOption;
