'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }               = require('@adonisjs/validator/src/Validator');
const SettingAdsRealEstateOption = use('App/Models/SettingAdsRealEstateOption');

/**
 * Resourceful controller for interacting with settingadsrealestateoptions
 */
class SettingAdsRealEstateOptionController {
  /**
   * Show a list of all settingadsrealestateoptions.
   * GET settingadsrealestateoptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const rules      = {
      setting_id: 'required',
      option_id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          setting_id,
          option_id,
        }                    = request.all();
    let {
          rule,
        }                    = request.headers();
    let newSetting           = new SettingAdsRealEstateOption();
    newSetting.real_esate_id = auth.authenticator(rule).user.id;
    newSetting.option_id     = option_id;
    newSetting.setting_id    = setting_id;
    await newSetting.save();
    return response.json({ status_code: 200 });
  }

  /**
   * Render a form to be used for creating a new settingadsrealestateoption.
   * GET settingadsrealestateoptions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new settingadsrealestateoption.
   * POST settingadsrealestateoptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single settingadsrealestateoption.
   * GET settingadsrealestateoptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing settingadsrealestateoption.
   * GET settingadsrealestateoptions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update settingadsrealestateoption details.
   * PUT or PATCH settingadsrealestateoptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a settingadsrealestateoption with id.
   * DELETE settingadsrealestateoptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = SettingAdsRealEstateOptionController;
