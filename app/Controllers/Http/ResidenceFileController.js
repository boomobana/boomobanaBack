'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const ResidenceFile = use('App/Models/ResidenceFile');
const Residence     = use('App/Models/Residence');
const PackageBuy    = use('App/Models/PackageBuy');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }  = require('@adonisjs/validator/src/Validator');
const { auth }      = require('mysql/lib/protocol/Auth');

/**
 * Resourceful controller for interacting with residencefiles
 */
class ResidenceFileController {
  async addPicture({ request, auth, response }) {
    const rules      = {
      residence_id: 'required',
      url: 'required',
      type: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          url,
          residence_id,
          type,
        } = request.all();
    let {
          rule,
        } = request.headers();
    if (rule === 'realEstate') {
      let pack = await PackageBuy.query().where('user_id', auth.user.id).last();
      if (!!pack && pack.after_time > new Date().getTime() && pack.after_count_video > 0) {
        pack.after_count_video -= 1;
        await pack.save();
        let res          = new ResidenceFile();
        res.url          = url;
        res.residence_id = residence_id;
        res.type         = type;
        res.save();
        let rq    = await Residence.query().where('id', residence_id).last();
        rq.levels = 2;
        await rq.save();
        return response.json({ status_code: 200, status_text: 'Successfully Done' });
      } else {
        return response.json({ status_code: 202, status_text: 'Unsuccessfully' });
      }
    } else {
      let res          = new ResidenceFile();
      res.url          = url;
      res.residence_id = residence_id;
      res.type         = type;
      res.save();
      let rq    = await Residence.query().where('id', residence_id).last();
      rq.levels = 2;
      await rq.save();
      return response.json({ status_code: 200, status_text: 'Successfully Done' });
    }
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

  async removeFile({ request, response }) {
    let res = await ResidenceFile.query().where('id', request.body.id).delete();
    return response.json({ status_code: 200 });
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
