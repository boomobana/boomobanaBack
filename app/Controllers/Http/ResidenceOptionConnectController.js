'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const ResidenceOptionConnect = use('App/Models/ResidenceOptionConnect');
const ResidenceOption        = use('App/Models/ResidenceOption');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }           = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with residenceoptionconnects
 */
class ResidenceOptionConnectController {
  async create({ request, response }) {
    const rules      = {
      residence_id: 'required',
      residence_option_id: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
          residence_option_id,
          description,
        } = request.all();
    try {
      let resOC                 = new ResidenceOptionConnect();
      resOC.residence_id        = residence_id;
      resOC.residence_option_id = residence_option_id;
      resOC.description         = description;
      resOC.save();
    } catch (e) {
      console.log(e);
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = ResidenceOptionConnectController;
