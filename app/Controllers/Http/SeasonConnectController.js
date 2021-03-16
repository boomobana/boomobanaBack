'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const SeasonConnect = require('../../Models/SeasonConnect');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }  = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with seasonconnects
 */
class SeasonConnectController {
  async addSeason({ request, response }) {
    const rules      = {
      residence_id: 'required',
      sd_id: 'required',
      price: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
          sd_id,
          price,
          description,
        }               = request.all();
    let seasCo          = new SeasonConnect();
    seasCo.residence_id = residence_id;
    seasCo.sd_id        = sd_id;
    seasCo.price        = price;
    seasCo.description  = description;
    seasCo.save();

    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SeasonConnectController;
