'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const { validate } = require('@adonisjs/validator/src/Validator');
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Creators     = use('App/Models/Creator');
const CreatorFile  = use('App/Models/CreatorFile');

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
    return response.json(await Creators.query().where('user_id', auth.user.id).orderBy('id', 'desc')
      .with('province')
      .with('region')
      .fetch());
  }

  async addFile({ request, response, auth }) {
    const rules      = {
      creator_id: 'required',
      file_url: 'required',
      file_type: 'required',
      title: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          creator_id,
          file_url,
          file_type,
          title,
          description,
        }           = request.all();
    let newS        = new CreatorFile();
    newS.creator_id = creator_id;
    if (typeof request.body.id != undefined && request.body.id != null) {
      newS = await CreatorFile.query().where('id', request.body.id).last();
    }
    newS.file_url    = file_url;
    newS.file_type   = file_type;
    newS.title       = title;
    newS.description = description;
    await newS.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async listFile({ request, response, auth }) {
    return response.json(await CreatorFile.query()
      .where('creator_id', request.input('creator_id'))
      .fetch(),
    );
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
      tell: 'required',
      scope: 'required',
      email: 'required',
      lat: 'required',
      lng: 'required',
      address: 'required',
      region_id: 'required',
      province_id: 'required',
      mizan_daraei: 'required',
      description: 'required',
      show_on: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          show_on,
          firstname,
          lastname,
          mobile,
          tell,
          scope,
          email,
          lat,
          lng,
          address,
          region_id,
          province_id,
          mizan_daraei,
          description,
        }        = request.all();
    let newS     = new Creators();
    newS.user_id = auth.user.id;
    if (typeof request.body.id != undefined && request.body.id != null) {
      newS = await Creators.query().where('id', request.body.id).last();
    }
    newS.show_on     = show_on;
    newS.firstname   = firstname;
    newS.lastname    = lastname;
    newS.mobile      = mobile;
    newS.tell        = tell;
    newS.scope       = scope;
    newS.email       = email;
    newS.lat         = lat;
    newS.lng         = lng;
    newS.address     = address;
    newS.region_id   = region_id;
    newS.province_id = province_id;
    newS.mizan_daraei = mizan_daraei;
    newS.description  = description;
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
    if (request.body.id !== undefined && request.body.id !== null)
      return response.json(await Creators.query().where('id', request.body.id).last());
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
