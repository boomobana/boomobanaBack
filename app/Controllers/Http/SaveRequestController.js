'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const SaveRequest  = use('App/Models/SaveRequest');
const { validate } = use('Validator');

/**
 * Resourceful controller for interacting with saverequests
 */
class SaveRequestController {
  /**
   * Show a list of all saverequests.
   * GET saverequests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    return response.json(await SaveRequest.query().where('user_id', auth.authenticator(request.header('rule')).fetch()));
  }

  /**
   * Render a form to be used for creating a new saverequest.
   * GET saverequests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      type: 'required',
      name: 'required',
      zaman_bazdid: 'required',
      zaman_karshenasi: 'required',
      description: 'required',
      address: 'required',
      mobile: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            type,
            name,
            zaman_bazdid,
            zaman_karshenasi,
            description,
            address,
            mobile,
          }                      = request.all();
    const { rule }               = request.headers();
    const user                   = auth.authenticator(rule).user;
    let newReq                   = new SaveRequest();
    newReq.slug                  = Math.floor(Math.random() * (999999999999 - 111111111111) + 111111111111);
    newReq.user_id               = user.id;
    newReq.type                  = type;
    newReq.name                  = name;
    newReq.zaman_bazdid          = zaman_bazdid;
    newReq.zaman_tamas_karshenas = zaman_karshenasi;
    newReq.description           = description;
    newReq.address               = address;
    newReq.mobile                = mobile;
    if (type == 3) {
      const rules2      = {
        area: 'required',
        price: 'required',
      };
      const validation2 = await validate(request.all(), rules2);
      if (validation2.fails()) {
        return response.json(validation2.messages());
      }
      const {
              area,
              price,
            }      = request.all();
      newReq.area  = area;
      newReq.price = price;
    } else {
      const rules3      = {
        rto_1: 'required',
      };
      const validation3 = await validate(request.all(), rules3);
      if (validation3.fails()) {
        return response.json(validation3.messages());
      }
      const {
              rto_1,
            }      = request.all();
      newReq.rto_2 = rto_1;
    }
    await newReq.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  /**
   * Create/save a new saverequest.
   * POST saverequests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single saverequest.
   * GET saverequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing saverequest.
   * GET saverequests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update saverequest details.
   * PUT or PATCH saverequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a saverequest with id.
   * DELETE saverequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = SaveRequestController;
