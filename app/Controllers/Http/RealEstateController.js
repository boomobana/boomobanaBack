'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const RealEstate = use('App/Models/RealEstate'),
      Residence  = use('App/Models/Residence');

/**
 * Resourceful controller for interacting with realestates
 */
class RealEstateController {
  /**
   * Show a list of all realestates.
   * GET realestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
  }

  async fetchOnly({ request, response, auth }) {
    let data = RealEstate.query().where('pageSignup', 3).whereNot('name', '-').select([
      'id',
      'name',
      'avatar',
      'lastname',
      'firstname',
    ]);
    if (request.body.textSearch != '' && request.body.textSearch !== null)
      data.where('name', 'like', '%' + request.body.textSearch + '%')
        .orWhere('name_en', 'like', '%' + request.body.textSearch + '%')
        .orWhere('lastname', 'like', '%' + request.body.textSearch + '%')
        .orWhere('firstname', 'like', '%' + request.body.textSearch + '%')
        .orWhere('lastname_en', 'like', '%' + request.body.textSearch + '%')
        .orWhere('firstname_en', 'like', '%' + request.body.textSearch + '%');
    return response.json(await data.fetch());
  }

  async searchNew({ request, response, auth }) {
    if (request.body.side === 'user') {
      let data = RealEstate.query().where('pageSignup', 3).whereNot('name', '-').select([
        'id',
        'name',
        'avatar',
        'lastname',
        'firstname',
      ]);
      if (request.body.textSearch != '' && request.body.textSearch !== null)
        data.where('name', 'like', '%' + request.body.textSearch + '%')
          .orWhere('name_en', 'like', '%' + request.body.textSearch + '%')
          .orWhere('lastname', 'like', '%' + request.body.textSearch + '%')
          .orWhere('firstname', 'like', '%' + request.body.textSearch + '%')
          .orWhere('lastname_en', 'like', '%' + request.body.textSearch + '%')
          .orWhere('firstname_en', 'like', '%' + request.body.textSearch + '%');
      return response.json(await data.fetch());
    } else {
      let data = Residence.query().with('User').with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season').where('archive', 0);
      if (request.body.side === 'rahnoejare') {
        data.where('type', 2);
      } else if (request.body.side === 'buysell') {
        data.where('type', 3);
      } else if (request.body.side === 'residence') {
        data.where('type', 1);
      } else if (request.body.side === 'residence') {
        data.where('type', 1).whereNotIn('rto_2', [5, 42]);
      } else if (request.body.side === 'residencevila') {
        data.where('type', 1).where('rto_2', 5);
      } else if (request.body.side === 'residencehotel') {
        data.where('type', 1).where('rto_2', 42);
      }
      if (request.body.regionChose != '' && request.body.regionChose !== null)
        data.where('region_id', request.body.regionChose);
      if (request.body.provinceChose != '' && request.body.provinceChose !== null)
        data.where('province_id', request.body.provinceChose);
      if (request.body.areaChose != '' && request.body.areaChose !== null && request.body.areaChose2 != '' && request.body.areaChose2 !== null)
        data.whereBetween('floor_area', [String(request.body.areaChose), String(request.body.areaChose2)]);
      if (request.body.priceChose != '' && request.body.priceChose !== null && request.body.priceChose2 != '' && request.body.priceChose2 !== null)
        data.whereBetween('month_discount', [String(request.body.priceChose), String(request.body.priceChose2)]);
      if (request.body.roomChose != '' && request.body.roomChose !== null)
        data.where('count_bathroom', request.body.roomChose);
      // if (request.body.regionChose != '' && request.body.regionChose !== null)
      //   data.where('region_id', request.body.regionChose)
      if (request.body.textSearch != '' && request.body.textSearch !== null)
        data.where('title', 'like', '%' + request.body.textSearch + '%')
          .orWhere('description', 'like', '%' + request.body.textSearch + '%');
      return response.json(await data.fetch());

    }
  }

  async findOnly({ request, response, auth }) {
    const { slug } = request.all();

    let data = RealEstate.query().where('id', slug).whereNot('name', '-').select([
      'id',
      'name',
      'avatar',
      'lastname',
      'firstname',
    ]).with('residence');
    return response.json(await data.last());
  }

  /**
   * Render a form to be used for creating a new realestate.
   * GET realestates/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new realestate.
   * POST realestates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single realestate.
   * GET realestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing realestate.
   * GET realestates/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update realestate details.
   * PUT or PATCH realestates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  async realEstateFetchAdmin({ params, request, response }) {
    return response.json(await RealEstate.query().paginate());
  }

  async realEstateActiveAdmin({ params, request, response }) {
    const {
            user_id,
            status,
          } = request.all();
    console.log(request.all());
    let user    = await RealEstate.query().where('id', user_id).last();
    user.active = status;
    await user.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = RealEstateController;
