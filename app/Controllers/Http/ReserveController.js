'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Reserved = use('App/Models/Reserved');

/**
 * Resourceful controller for interacting with regions
 */
class ReserveController {
  /**
   * Show a list of all regions.
   * GET regions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await Reserved.query().with('Residence').where('user_id', auth.authenticator(rule).user.id).fetch());
  }

  /**
   * Render a form to be used for creating a new region.
   * GET regions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const { rule }          = request.headers();
    const {
            residence_id,
            start_time,
            end_time,
            count_user,
          }                 = request.all();
    const ReserveS          = new Reserved();
    ReserveS.user_id        = auth.authenticator(rule).user.id;
    ReserveS.residence_id   = residence_id;
    ReserveS.start_time     = start_time;
    ReserveS.end_time       = end_time;
    ReserveS.count_user     = count_user;
    ReserveS.transaction_id = Math.floor(Math.random() * (999999 - 111111) + 111111);
    ReserveS.slug           = Math.floor(Math.random() * (999999 - 111111) + 111111) + '-' + Math.floor(Math.random() * (999999 - 111111) + 111111) + '-' + Math.floor(Math.random() * (999999 - 111111) + 111111);
    await ReserveS.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  /**
   * Create/save a new region.
   * POST regions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single region.
   * GET regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing region.
   * GET regions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update region details.
   * PUT or PATCH regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a region with id.
   * DELETE regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ReserveController;