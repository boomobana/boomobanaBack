'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const { validate } = require('@adonisjs/validator/src/Validator');
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Creators     = use('App/Models/Creator');

/**
 * Resourceful controller for interacting with creators
 */
class CreatorController {
  /**
   * Show a list of all creators.
   * GET creators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    return response.json(await Creators.query().where('user_id', auth.user.id).orderBy('id', 'desc').fetch());
  }

  /**
   * Render a form to be used for creating a new creator.
   * GET creators/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      firstname: 'required',
      lastname: 'required',
      mobile: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          firstname,
          lastname,
          mobile,
        }        = request.all();
    let newS     = new Creators();
    newS.user_id = auth.user.id;
    // if (request.body.id != '') {
    //   newS = await Creators.query().where('id', request.body.residence_id).last();
    // }
    newS.firstname = firstname;
    newS.lastname  = lastname;
    newS.mobile    = mobile;
    await newS.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async deletes({ request, response, auth }) {
    await Creators.query().where('id', request.body.id).delete();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });

  }

  /**
   * Create/save a new creator.
   * POST creators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single creator.
   * GET creators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing creator.
   * GET creators/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update creator details.
   * PUT or PATCH creators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a creator with id.
   * DELETE creators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = CreatorController;