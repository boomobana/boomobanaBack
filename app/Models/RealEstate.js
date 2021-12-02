'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Hash  = use('Hash');

class RealEstate extends Model {
  static get table() {
    return 'users';
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  tokens() {
    return this.hasMany('App/Models/Token');
  }

  residence() {
    return this.hasMany('App/Models/Residence', 'id', 'user_id').with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province');
  }
}

module.exports = RealEstate;
