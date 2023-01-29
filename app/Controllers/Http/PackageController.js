'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
var Package     = use('App/Models/Package');
var Transaction = use('App/Models/Transaction');
const {
        makeid,
      }         = require('../Helper');

/**
 * Resourceful controller for interacting with packages
 */
class PackageController {
  /**
   * Show a list of all packages.
   * GET packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {
    return response.json(await Package.query().where('are_load', 1).where('status', 1).fetch());
  }

  /**
   * Render a form to be used for creating a new package.
   * GET packages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    let { rule }                   = request.headers();
    let { id }                     = request.params;
    let { title, price, discount } = await Package.query().where('id', id).last();
    let slug                       = makeid(5, 10, 5);
    let newBuy                     = new Transaction();
    newBuy.user_id                 = auth.user.id;
    newBuy.slug                    = slug;
    newBuy.gateway                 = 'zarinpal';
    newBuy.type_of_transaction     = 'package';
    newBuy.ref_3                   = id;
    newBuy.price                   = parseInt(price) - parseInt(discount);
    newBuy.price_without           = price;
    newBuy.description             = `خرید پکیج ${title}`;
    await newBuy.save();
    return response.json({ status_code: 200, slug: slug });
  }

  /**
   * Create/save a new package.
   * POST packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single package.
   * GET packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing package.
   * GET packages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update package details.
   * PUT or PATCH packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a package with id.
   * DELETE packages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }

  async packageFetchAdmin({ params, request, response }) {
    const { page } = request.qs;
    const limit    = 10;
    return response.json(await Package.query().where('are_load', 1).paginate(page, limit));
  }

  async packageFindAdmin({ request, response }) {
    return response.json(await Package.query().where('id', request.body.id).last());
  }

  async packageAddAdmin({ request, response }) {
    if (request.body.id != 0) {
      await Package.query().where('id', request.body.id).update(request.body);
    } else {
      await Package.create({ ...request.body, are_load: 1 });
    }
    return response.json({ status_code: 200 });
  }

  async packageEnableAdmin({ request, response }) {
    let pack   = await Package.query().where('id', request.body.id).last();
    let status = 0;
    if (pack.status == 1)
      status = 0;
    await Package.query().where('id', request.body.id).update({ status });
    return response.json({ status_code: 200 });
  }
}

module.exports = PackageController;
