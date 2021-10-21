'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const ResidenceTypeOption = use('App/Models/ResidenceTypeOption');
const Residence           = use('App/Models/Residence');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }        = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with residencetypeoptions
 */
class ResidenceTypeOptionController {
  /**
   * Show a list of all residenceoptions.
   * GET residenceoptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    let data = await ResidenceTypeOption.all();
    return response.json(data);
  }

  async changeType({ request, response }) {
    const rules      = {
      residence_id: 'required',
      rto_1: 'required',
      rto_2: 'required',
      rto_3: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          rto_1,
          rto_2,
          rto_3,
          residence_id,
        } = request.all();

    let res   = await Residence.query().where('id', residence_id).last();
    res.rto_1 = rto_1;
    res.rto_2 = rto_2;
    res.rto_3 = rto_3;
    await res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeStatus({ request, response }) {
    const rules      = {
      residence_id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
        } = request.all();

    let res    = await Residence.query().where('id', residence_id).last();
    res.status = 1;
    await res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = ResidenceTypeOptionController;
