'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
var Adviser           = use('App/Models/Adviser'),
    AdviserRealEstate = use('App/Models/AdviserRealEstate'),
    { validate }      = use('Validator');

/**
 * Resourceful controller for interacting with packages
 */
class AdvisorController {
  /**
   * Show a list of all packages.
   * GET packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, response }) {
    return response.json(await AdviserRealEstate.query().where('real_estate_id', auth.user.id).with(['Advisor']).fetch());
  }

  async find({ auth, response, request }) {
    const { id } = request.all();
    return response.json(await AdviserRealEstate.query().where('id', id).where('real_estate_id', auth.user.id).with(['Advisor']).last());
  }

  /**
   * Render a form to be used for creating a new package.
   * GET packages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules      = {
      fileUrl: 'required',
      firstname: 'required',
      lastname: 'required',
      mobile: 'required|unique:advisers ,mobile',
      email: 'required',
      password: 'required',
      type: 'required',
      male: 'required',
      count_file_rent: 'required',
      count_file_sell: 'required',
      count_occasion: 'required',
      count_instant: 'required',
      count_ladder: 'required',
      count_video: 'required',
      count_file_adviser: 'required',
      count_file_archive: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            fileUrl,
            firstname,
            lastname,
            mobile,
            email,
            password,
            type,
            male,
            count_file_rent,
            count_file_sell,
            count_occasion,
            count_instant,
            count_ladder,
            count_video,
            count_file_adviser,
            count_file_archive,
          }              = request.all();
    const {
            rule,
          }              = request.headers();
    let newAdviser       = new Adviser();
    newAdviser.firstname = firstname;
    newAdviser.lastname  = lastname;
    newAdviser.email     = email;
    newAdviser.mobile    = mobile;
    newAdviser.password  = password;
    newAdviser.role      = type;
    newAdviser.lat       = 0;
    newAdviser.lng       = 0;
    newAdviser.address   = '';
    // newAdviser.active_code = Math.floor(Math.random() * 100000);
    newAdviser.avatar    = fileUrl;
    newAdviser.male      = male;
    let savedData        = await newAdviser.save();

    let newRealAdviserRealEstate                = new AdviserRealEstate();
    newRealAdviserRealEstate.real_estate_id     = auth.user.id;
    newRealAdviserRealEstate.adviser_id         = newAdviser.id;
    newRealAdviserRealEstate.count_file_rent    = count_file_rent;
    newRealAdviserRealEstate.count_file_sell    = count_file_sell;
    newRealAdviserRealEstate.count_occasion     = count_occasion;
    newRealAdviserRealEstate.count_instant      = count_instant;
    newRealAdviserRealEstate.count_ladder       = count_ladder;
    newRealAdviserRealEstate.count_video        = count_video;
    newRealAdviserRealEstate.count_file_adviser = count_file_adviser;
    newRealAdviserRealEstate.count_file_archive = count_file_archive;
    newRealAdviserRealEstate.status             = 0;
    await newRealAdviserRealEstate.save();
    return response.json({ status_code: 200, id: newRealAdviserRealEstate.id });
  }

  async address({ request, response, auth }) {
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules      = {
      id: 'required',
      address: 'required',
      lat: 'required',
      lng: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            address,
            id,
            lat,
            lng,
          }            = request.all();
    let { adviser_id } = await AdviserRealEstate.query().where('id', id).last();
    let newAdviser     = await Adviser.query().where('id', adviser_id).last();
    newAdviser.lat     = String(lat);
    newAdviser.lng     = String(lng);
    newAdviser.address = address;
    if (request.body.kartMeli && request.body.kartMeli !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.kart_meli = request.body.kartMeli;
    if (request.body.resome && request.body.resome !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.resome = request.body.resome;
    if (request.body.taeahodat && request.body.taeahodat !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.taeahodat = request.body.taeahodat;
    if (request.body.gharardad && request.body.gharardad !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.gharardad = request.body.gharardad;
    let savedData = await newAdviser.save();

    return response.json({ status_code: 200, id: newAdviser.id });
  }

  /**
   * Create/save a new package.
   * POST packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single package.
   * GET packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing package.
   * GET packages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update package details.
   * PUT or PATCH packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a package with id.
   * DELETE packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = AdvisorController;
