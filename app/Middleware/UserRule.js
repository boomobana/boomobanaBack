'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class UserRule {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, auth, response }, next) {
    // call next to advance the request
    const { rule } = request.headers();
    if (rule === 'admin' && !!auth.user && auth.user.is_admin == 1) {
      await next();
    } else if (rule === 'realEstate' && !!auth.user && auth.user.is_realestate == 1) {
      await next();
    } else if (rule === 'blogger' && !!auth.user && auth.user.is_bloger == 1) {
      await next();
    } else if (rule === 'user' && !!auth.user && auth.user.is_user == 1) {
      await next();
    } else if (rule === 'advisor' && !!auth.user && auth.user.is_advisor == 1) {
      await next();
    } else {
      return response.status(420).json({ status_code: 420, status_text: 'Access Is Denied' });
    }
  }
}

module.exports = UserRule;
