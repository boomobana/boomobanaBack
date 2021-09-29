'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const RealEstate = use('App/Models/RealEstate');

/**
 * Resourceful controller for interacting with realestates
 */
class RealEstateController {
  /**
   * Show a list of all realestates.
   * GET realestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
  }

  async fetchOnly({ request, response, auth }) {
    return response.json(await RealEstate.query().where('pageSignup', 3).whereNot('name', '-').select([
      'id',
      'name',
      'avatar',
    ]).fetch());
  }

  /**
   * Render a form to be used for creating a new realestate.
   * GET realestates/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new realestate.
   * POST realestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single realestate.
   * GET realestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing realestate.
   * GET realestates/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update realestate details.
   * PUT or PATCH realestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  async realEstateFetchAdmin({ params, request, response }) {
    return response.json(await RealEstate.query().paginate());
  }

  async realEstateActiveAdmin({ params, request, response }) {
    const {
            user_id,
            status,
          } = request.all();
    console.log(request.all());
    let user    = await RealEstate.query().where('id', user_id).last();
    user.active = status;
    await user.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = RealEstateController;
