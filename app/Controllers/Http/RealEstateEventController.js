'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const { validate }    = use('Validator'),
      RealEstateEvent = use('App/Models/RealEstateEvent');

/**
 * Resourceful controller for interacting with realestateevents
 */
class RealEstateEventController {
  /**
   * Show a list of all realestateevents.
   * GET realestateevents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await RealEstateEvent.query().where('real_estate_id', auth.user.id).where('time', 'like', '%' + request.input('time') + '%').fetch());

  }

  /**
   * Render a form to be used for creating a new realestateevent.
   * GET realestateevents/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      time: 'required',
      title: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            time,
            title,
            description,
          }        = request.all();
    const { rule } = request.headers();
    const user     = auth.user;
    let newCust    = new RealEstateEvent();

    newCust.real_estate_id = user.id;
    // if (await RealEstateCustomer.query().where('description', description).where('real_estate_id', user.id).fetch().length != 0) {
    //   newCust = await RealEstateCustomer.query().where('description', description).where('real_estate_id', user.id).last();
    // }
    newCust.time        = time;
    newCust.title       = title;
    newCust.description = description;
    await newCust.save();
    return response.json({ status_code: 200 });

  }

  /**
   * Create/save a new realestateevent.
   * POST realestateevents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async remove({ request, response }) {
    const { id } = request.all();
    await RealEstateEvent.query().where('id', id).delete();
    return response.json({ status_code: 200 });
  }

  /**
   * Display a single realestateevent.
   * GET realestateevents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async find({ request, response }) {
    const { id } = request.all();
    return response.json(await RealEstateEvent.query().where('id', id).last());

  }

  /**
   * Render a form to update an existing realestateevent.
   * GET realestateevents/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update realestateevent details.
   * PUT or PATCH realestateevents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  async eventFetchAdmin({ params, request, response }) {
    return response.json(await RealEstateEvent.query().paginate());
  }
}

module.exports = RealEstateEventController;
