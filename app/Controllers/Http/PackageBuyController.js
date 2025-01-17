'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const PackageBuy = use('App/Models/PackageBuy');

/**
 * Resourceful controller for interacting with packagebuys
 */
class PackageBuyController {
  /**
   * Show a list of all packagebuys.
   * GET packagebuys
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await PackageBuy.query().where('user_id', auth.user.id).with('package').with('transaction').orderBy('id', 'desc').fetch());
  }

  async fetchMy({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await PackageBuy.query().where('user_id', auth.user.id).with('package').with('transaction').orderBy('id', 'desc').last());
  }

  /**
   * Render a form to be used for creating a new packagebuy.
   * GET packagebuys/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async isVip({ request, response, auth }) {
    const { rule }  = request.headers();
    let package_buy = await PackageBuy.query().where('user_id', auth.user.id).last();
    if (!!package_buy && !!package_buy.after_time && package_buy.after_time != 0) {
      if (package_buy.after_time > new Date().getTime()) {
        return response.json({ status_code: 200 });
      } else {
        return response.json({ status_code: 201 });
      }
    } else {
      return response.json({ status_code: 201 });
    }
  }

  /**
   * Create/save a new packagebuy.
   * POST packagebuys
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single packagebuy.
   * GET packagebuys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing packagebuy.
   * GET packagebuys/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update packagebuy details.
   * PUT or PATCH packagebuys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a packagebuy with id.
   * DELETE packagebuys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = PackageBuyController;
