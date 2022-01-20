'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

class User extends Model {
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

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  residence() {
    return this.hasMany('App/Models/Residence', 'id', 'user_id').with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province');
  }

  favorite() {
    return this.hasMany('App/Models/FavoriteAd', 'id', 'user_id').with('Residence');
  }

  transaction() {
    return this.hasMany('App/Models/Transaction', 'id', 'user_id');
  }

  Ticket() {
    return this.hasMany('App/Models/Ticket', 'id', 'user_id').with('user').with('pm');
  }

  Event() {
    return this.hasMany('App/Models/RealEstateEvent', 'id', 'real_estate_id').with('user');
  }

  Customers() {
    return this.hasMany('App/Models/RealEstateCustomer', 'id', 'real_estate_id').with('user').with('region').with('province');
  }

  Creators() {
    return this.hasMany('App/Models/Creator', 'id', 'user_id');
  }

  Blog() {
    return this.hasMany('App/Models/BlogPost', 'id', 'user_id').with('Files').withCount('Comment').with('Categories');
  }

  packageBuy() {
    return this.hasMany('App/Models/PackageBuy', 'id', 'user_id').with('package').with('transaction');
  }
}

module.exports = User;
