'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const ChatIndex = use('App/Models/ChatIndex');

/**
 * Resourceful controller for interacting with cancelpolicies
 */
class CancelPolicyController {
  async index({ request, response, view }) {
    return response.json(await ChatIndex.query().with('LChat', (builder) => {
      builder.orderBy('id', 'asc');
    }).with('user').fetch());
  }
}

module.exports = CancelPolicyController;
