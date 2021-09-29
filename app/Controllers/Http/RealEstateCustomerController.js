'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const RealEstateCustomer = use('App/Models/RealEstateCustomer');
const { validate }       = use('Validator');

/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with realestatecustomers
 */
class RealEstateCustomerController {
  /**
   * Show a list of all realestatecustomers.
   * GET realestatecustomers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await RealEstateCustomer.query().where('real_estate_id', auth.authenticator(rule).user.id).fetch());
  }

  /**
   * Render a form to be used for creating a new realestatecustomer.
   * GET realestatecustomers/create
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
      email: 'required',
      type: 'required',
      type_customer: 'required',
      options: 'required',
      description: 'required',
      region_id: 'required',
      province_id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            firstname,
            lastname,
            mobile,
            tell,
            email,
            type,
            type_customer,
            options,
            description,
            region_id,
            province_id,
          }        = request.all();
    const { rule } = request.headers();
    const user     = auth.authenticator(rule).user;
    let newCust    = new RealEstateCustomer();

    newCust.real_estate_id = user.id;
    // if (await RealEstateCustomer.query().where('mobile', mobile).where('real_estate_id', user.id).fetch().length != 0) {
    //   newCust = await RealEstateCustomer.query().where('mobile', mobile).where('real_estate_id', user.id).last();
    // }
    newCust.firstname     = firstname;
    newCust.lastname      = lastname;
    newCust.mobile        = mobile;
    newCust.tell          = tell;
    newCust.email         = email;
    newCust.type          = type;
    newCust.type_customer = type_customer;
    newCust.options       = options;
    newCust.description   = description;
    newCust.region_id     = region_id;
    newCust.province_id   = province_id;
    await newCust.save();
    return response.json({ status_code: 200 });
  }

  /**
   * Create/save a new realestatecustomer.
   * POST realestatecustomers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async find({ request, response }) {
    const { id } = request.all();
    return response.json(await RealEstateCustomer.query().where('id', id).last());
  }

  /**
   * Create/save a new realestatecustomer.
   * POST realestatecustomers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async remove({ request, response }) {
    const { id } = request.all();
    await RealEstateCustomer.query().where('id', id).delete();
    return response.json({ status_code: 200 });
  }

  /**
   * Display a single realestatecustomer.
   * GET realestatecustomers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing realestatecustomer.
   * GET realestatecustomers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update realestatecustomer details.
   * PUT or PATCH realestatecustomers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a realestatecustomer with id.
   * DELETE realestatecustomers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }

  async customerFetchAdmin({ params, request, response }) {
    return response.json(await RealEstateCustomer.query().paginate());
  }
}

module.exports = RealEstateCustomerController;
