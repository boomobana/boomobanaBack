'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }         = require('@adonisjs/validator/src/Validator');
const SettingAdsRealEstate = use('App/Models/SettingAdsRealEstate');

/**
 * Resourceful controller for interacting with settingadsrealestates
 */
class SettingAdsRealEstateController {
  /**
   * Show a list of all settingadsrealestates.
   * GET settingadsrealestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const rules      = {
      get: 'required',
      title: 'required',
      rto_1: 'required',
      rto_2: 'required',
      rto_3: 'required',
      max_area: 'required',
      min_area: 'required',
      region_id: 'required',
      province_id: 'required',
      description: 'required',
      admin: 'required',
      advisor: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          get,
          title,
          rto_1,
          rto_2,
          rto_3,
          max_area,
          min_area,
          region_id,
          province_id,
          description,
          admin,
          advisor,
        }          = request.all();
    let {
          rule,
        }          = request.headers();
    let newSetting = new SettingAdsRealEstate();
    if (!!await SettingAdsRealEstate.query().where('real_estate_id', auth.authenticator(rule).user.id).last()) {
      newSetting = await SettingAdsRealEstate.query().where('real_estate_id', auth.user.id).last();
    }
    newSetting.real_estate_id = auth.authenticator(rule).user.id;
    newSetting.get            = get;
    newSetting.title          = title;
    newSetting.rto_1          = rto_1;
    newSetting.rto_2          = rto_2;
    newSetting.rto_3          = rto_3;
    newSetting.max_area       = max_area;
    newSetting.min_area       = min_area;
    newSetting.region_id      = region_id;
    newSetting.province_id    = province_id;
    newSetting.description    = description;
    newSetting.admin          = admin;
    newSetting.advisor        = advisor;
    await newSetting.save();
    return response.json({ status_code: 200, ...newSetting.$attributes });
  }

  /**
   * Render a form to be used for creating a new settingadsrealestate.
   * GET settingadsrealestates/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async fetch({ request, response, auth }) {
    return response.json(await SettingAdsRealEstate.query().with('options').where('real_estate_id', auth.user.id).last());
  }

  /**
   * Create/save a new settingadsrealestate.
   * POST settingadsrealestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single settingadsrealestate.
   * GET settingadsrealestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing settingadsrealestate.
   * GET settingadsrealestates/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update settingadsrealestate details.
   * PUT or PATCH settingadsrealestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a settingadsrealestate with id.
   * DELETE settingadsrealestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = SettingAdsRealEstateController;
