'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const Social     = use('App/Models/Social');
const SocialUser = use('App/Models/SocialUser');

/**
 * Resourceful controller for interacting with admins
 */
class SocialController {
  /**
   * Show a list of all admins.
   * GET admins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async SocialIndex({ request, response, view }) {
    return response.json(await Social.query().fetch());
  }

  async SocialUserIndex({ request, response, auth }) {
    return response.json(await SocialUser.query().where('user_id', auth.user.id).fetch());
  }

  async SocialUserCreate({ request, response, auth }) {
    console.log(request.all());
    if (request.body.id != '')
      await SocialUser.query().where('id', request.body.id).update(request.all());
    else
      await SocialUser.create({ ...request.all(), user_id: auth.user.id });
    return response.json({ status_code: 200, status_text: 'successfully done' });
  }

  async SocialUserDelete({ request, response, auth }) {
    await SocialUser.query().where('id', request.body.id).delete();
    return response.json({ status_code: 200, status_text: 'successfully done' });
  }

  /**
   * Render a form to be used for creating a new admin.
   * GET admins/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new admin.
   * POST admins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single admin.
   * GET admins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing admin.
   * GET admins/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update admin details.
   * PUT or PATCH admins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a admin with id.
   * DELETE admins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = SocialController;
