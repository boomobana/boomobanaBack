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
    return response.json(await RealEstateCustomer.query().where('real_estate_id', auth.user.id).orderBy('id', 'desc')
      .with('RTO_2').with('RTO_3').with('region').with('province').fetch());
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
      type_melk: 'required',
      type_user: 'required',
      title: 'required',
      metraj_kol: 'required',
      metraj_bana: 'required',
      melk_age: 'required',
      count_bed: 'required',
      emkanat: 'required',
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
            type_melk,
            type_user,
            title,
            metraj_kol,
            metraj_bana,
            melk_age,
            count_bed,
            emkanat,
            show_on,
          }                = request.all();
    const { rule }         = request.headers();
    const user             = auth.user;
    let newCust            = new RealEstateCustomer();
    newCust.real_estate_id = user.id;
    if (await RealEstateCustomer.query().where('id', request.input('id')).first())
      newCust = await RealEstateCustomer.query().where('id', request.input('id')).first();

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
    newCust.type_melk     = type_melk;
    newCust.type_user     = type_user;
    newCust.title         = title;
    newCust.metraj_kol    = metraj_kol;
    newCust.metraj_bana   = metraj_bana;
    newCust.melk_age      = melk_age;
    newCust.count_bed     = count_bed;
    newCust.emkanat       = emkanat;
    if (auth.user.is_advisor === 1)
      newCust.show_on = show_on;
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
    const { page } = request.qs;
    const limit    = 10;
    let RECustomer = RealEstateCustomer.query().orderBy('id', 'desc').with('user').with('region').with('province');
    return response.json(await RECustomer.paginate(page, limit));
  }

  async customerFindAdmin({ params, request, response }) {
    let RECustomer = RealEstateCustomer.query().where('id', request.body.id);
    return response.json(await RECustomer.last());
  }

  async customerAddAdmin({ params, request, response }) {
    const {
            firstname,
            lastname,
            mobile,
            tell,
            email,
            province_id,
            region_id,
            options,
            type_customer,
            type,
            description,
            real_estate_id,
            type_melk,
            type_user,
            emkanat,
            show_on,
          } = request.all();
    console.log(request.all());
    let re = new RealEstateCustomer();
    if (!!request.body.id && request.body.id != '') {
      re = await RealEstateCustomer.query().where('id', request.body.id).last();
    }
    console.log(re);
    re.firstname      = firstname;
    re.lastname       = lastname;
    re.mobile         = mobile;
    re.tell           = tell;
    re.email          = email;
    re.province_id    = province_id;
    re.region_id      = region_id;
    re.options        = options;
    re.type_customer  = type_customer;
    re.type           = type;
    re.description    = description;
    re.real_estate_id = real_estate_id;
    re.type_melk      = type_melk;
    re.type_user      = type_user;
    re.emkanat        = emkanat;
    re.show_on        = show_on;
    await re.save();

    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = RealEstateCustomerController;
