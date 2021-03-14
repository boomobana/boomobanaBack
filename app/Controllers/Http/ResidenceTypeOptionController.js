'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const ResidenceTypeOption = require('../../Models/ResidenceTypeOption');
const Residence           = require('../../Models/Residence');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }        = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with residencetypeoptions
 */
class ResidenceTypeOptionController {
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
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = ResidenceTypeOptionController;
