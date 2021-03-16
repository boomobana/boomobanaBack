'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const ResidenceFile = use('App/Models/ResidenceFile');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }  = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with residencefiles
 */
class ResidenceFileController {
  async addPicture({ request, response }) {
    const rules      = {
      residence_id: 'required',
      url: 'required',
      type: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let { url, residence_id, type } = request.all();

    let res          = new ResidenceFile();
    res.url          = url;
    res.residence_id = residence_id;
    res.type         = type;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetchFile({ request, response }) {
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

    let res = await ResidenceFile.query().where('residence_id', residence_id).fetch();
    return response.json(res);
  }

  async changeDescription({ request, response }) {
    const rules      = {
      id: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          id,
          description,
        } = request.all();

    let res         = await ResidenceFile.query().where('id', id).last();
    res.description = description;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = ResidenceFileController;
