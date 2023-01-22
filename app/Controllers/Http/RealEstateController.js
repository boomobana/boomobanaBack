'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const RealEstate     = use('App/Models/RealEstate'),
      Region         = use('App/Models/Region'),
      RealestateLink = use('App/Models/RealestateLink'),
      Residence      = use('App/Models/Residence');

const ResidenceOptionConnect = use('App/Models/ResidenceOptionConnect');

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

  async indexFetchMyLinks({ request, response, auth }) {
    if (request.body.type == 1)
      return response.json(await RealestateLink.query().with('Residence').where('user_id', auth.user.id).fetch());
    else if (request.body.type == 2)
      return response.json(await RealestateLink.query().with('Request').where('user_id', auth.user.id).fetch());
  }

  async fetchOnly({ request, response, auth }) {
    let data = RealEstate.query().where('pageSignup', '3').whereNot('username', '-').whereNot('name', '-').where('active', '1');
    if (request.body.textSearch && request.body.textSearch != '' && request.body.textSearch !== null)
      data.where('name', 'like', '%' + request.body.textSearch + '%')
        .orWhere('name_en', 'like', '%' + request.body.textSearch + '%')
        .orWhere('lastname', 'like', '%' + request.body.textSearch + '%')
        .orWhere('firstname', 'like', '%' + request.body.textSearch + '%')
        .orWhere('lastname_en', 'like', '%' + request.body.textSearch + '%')
        .orWhere('firstname_en', 'like', '%' + request.body.textSearch + '%');
    /*if (request.body.province_id && request.body.province_id != 0)
      data.whereIn('region',
        ((await Region.query().where('province_id', request.body.province_id).fetch()).rows.map(e => e.id)),
      );*/
    if (request.body.firstname && request.body.firstname != '' && request.body.firstname != 0)
      data.where('firstname', 'like', `%${request.body.firstname}%`);
    if (request.body.lastname && request.body.lastname != '' && request.body.lastname != 0)
      data.where('lastname', 'like', `%${request.body.lastname}%`);
    if (request.body.name && request.body.name != '' && request.body.name != 0)
      data.where('name', 'like', `%${request.body.name}%`);
    if (request.body.mobile && request.body.mobile != '' && request.body.mobile != 0)
      data.where('mobile', 'like', `%${request.body.mobile}%`);
    if (request.body.province_id && request.body.province_id != '' && request.body.province_id != 0)
      data.where('realestate_province', request.body.province_id);
    return response.json(await data.select([
      'id',
      'name',
      'avatar',
      'lastname',
      'firstname',
      'username',
    ]).fetch());
  }

  async searchNew({ request, response, auth }) {
    if (request.body.side === 'user') {
      let data = RealEstate.query().where('pageSignup', 3).whereNot('name', '-').whereNot('username', '-').select([
        'id',
        'name',
        'avatar',
        'lastname',
        'firstname',
        'username',
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
      let data = Residence.query()
        .with('User')
        .with('Files')
        .with('Option')
        .with('Room')
        .with('RTO1')
        .with('RTO2')
        .with('RTO3')
        .with('Region')
        .with('Province')
        .with('Season')
        .where('archive', 0)
        .where('status', 2);
      if (request.body.side === 'rahnoejare') {
        data.where('type', 2);
      } else if (request.body.side === 'buysell') {
        data.where('type', 3);
      } else if (request.body.side === 'residence') {
        data.where('type', 1).whereNotIn('rto_2', [5, 42]);
      } else if (request.body.side === 'residencevila') {
        data.where('type', 1).where('rto_2', 5);
      } else if (request.body.side === 'residencehotel') {
        data.where('type', 1).where('rto_2', 42);
      }
      if (request.body.regionChose != '' && request.body.regionChose != 0 && request.body.regionChose !== null)
        data.where('region_id', request.body.regionChose);
      if (request.body.provinceChose != '' && request.body.provinceChose != 0 && request.body.provinceChose !== null)
        data.where('province_id', request.body.provinceChose);
      if (request.body.areaChose != '' && request.body.areaChose != 0 && request.body.areaChose !== null && request.body.areaChose2 != '' && request.body.areaChose2 != 0 && request.body.areaChose2 !== null)
        data.whereBetween('floor_area', [String(request.body.areaChose), String(request.body.areaChose2)]);
      if (request.body.priceChose != '' && request.body.priceChose != 0 && request.body.priceChose !== null && request.body.priceChose2 != '' && request.body.priceChose2 !== null)
        data.whereBetween('month_discount', [String(request.body.priceChose), String(request.body.priceChose2)]);
      if (request.body.roomChose != '' && request.body.roomChose != 0 && request.body.roomChose !== null)
        data.where('count_bathroom', request.body.roomChose);
      if (request.body.rto_1 && request.body.rto_1 != 0) {
        data.where('rto_2', request.body.rto_1);
      }
      if (request.body.rto_2 && request.body.rto_2 != 0) {
        data.where('rto_3', request.body.rto_2);
      }
      let {
            options,
          } = request.all();

      let arrayOp = [];
      if (options.length != 0) {
        for (let i = 0; i < options.length; i++) {
          const item     = options[i];
          let getOptions = await ResidenceOptionConnect.query().where('residence_option_id', item.id).fetch();
          for (let j = 0; j < getOptions.rows.length; j++) {
            const opt = getOptions.rows[j];
            if (arrayOp.filter(e => e != opt.residence_id).length == 0) {
              arrayOp.push(opt.residence_id);
            }
          }
        }
        data.whereIn('id', arrayOp);
      }

      // if (request.body.regionChose != '' && request.body.regionChose !== null)
      //   data.where('region_id', request.body.regionChose)
      if (request.body.textSearch != '' && request.body.textSearch !== null) {
        let datas = Residence.query().where('archive', 0).where('status', 2);
        datas.where('title', 'like', '%' + request.body.textSearch + '%')
          .orWhere('description', 'like', '%' + request.body.textSearch + '%')
          .select(['id']);
        let da = [];
        for (let row of (await datas.fetch()).rows) {
          da.push(row.id);
        }
        data.whereIn(id, da);
      }
      if (request.body.sen1 != 0 && request.body.sen2 != 0) {
        data.where('age', '>=', request.body.sen1).where('age', '<=', request.body.sen2);
      }
      if (request.body.price1 != 0 && request.body.price2 != 0 && request.body.price1 != null && request.body.price2 != null) {
        data.where('month_discount', '>=', request.body.price1).where('month_discount', '<=', request.body.price2);
      }
      if (request.body.meter1 != 0 && request.body.meter2 != 0) {
        data.whereBetween('floor_area', [String(request.body.meter1), String(request.body.meter2)]);
      }
      try {
        return response.json(await data.fetch());
      } catch (e) {
      }
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
    ]).with('residence', q => {
      q.where('archive', 0).where('status', 2);
    });
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
          }                = request.all();
    let user               = await RealEstate.query().where('id', user_id).last();
    user.active            = status;
    user.userDetailsChange = 2;
    await user.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = RealEstateController;
