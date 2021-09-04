'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const { validate }                = require('@adonisjs/validator/src/Validator');
/** @typedef {import('@adonisjs/framework/src/View')} View */
const SettingAdsRealEstateConnect = use('App/Models/SettingAdsRealEstateConnect');

/**
 * Resourceful controller for interacting with settingadsrealestateconnects
 */
class SettingAdsRealEstateConnectController {
  /**
   * Show a list of all settingadsrealestateconnects.
   * GET settingadsrealestateconnects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    let {
          rule,
        }        = request.headers();
    let getPosts = SettingAdsRealEstateConnect.query().orderBy('id', 'desc').where('real_estate_id', auth.authenticator(rule).user.id).with('residence');
    return response.json(await getPosts.fetch());
  }

  /**
   * Render a form to be used for creating a new settingadsrealestateconnect.
   * GET settingadsrealestateconnects/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new settingadsrealestateconnect.
   * POST settingadsrealestateconnects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single settingadsrealestateconnect.
   * GET settingadsrealestateconnects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing settingadsrealestateconnect.
   * GET settingadsrealestateconnects/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update settingadsrealestateconnect details.
   * PUT or PATCH settingadsrealestateconnects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a settingadsrealestateconnect with id.
   * DELETE settingadsrealestateconnects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = SettingAdsRealEstateConnectController;
