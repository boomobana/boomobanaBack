'use strict';

const Hash = use('Hash');

const RealEstateHook = module.exports = {};

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
RealEstateHook.hashPassword = async (userInstance) => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password);
  }
};
