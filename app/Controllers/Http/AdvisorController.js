'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
var Adviser           = use('App/Models/Adviser'),
    AdviserRealEstate = use('App/Models/AdviserRealEstate'),
    User              = use('App/Models/User'),
    Sms               = use('App/Controllers/Http/SmsSender'),
    { validate }      = use('Validator'),
    Database          = use('Database');

/**
 * Resourceful controller for interacting with packages
 */
class AdvisorController {
  /**
   * Show a list of all packages.
   * GET packages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, response }) {
    return response.json(await AdviserRealEstate.query().where('real_estate_id', auth.user.id).with('Realestate').with(['Advisor']).fetch());
  }

  async indexReport({ auth, response }) {
    let from     = '2021-04-23' + ' 00:00:00',
        to       = '2022-02-23' + ' 00:00:00',
        allFiles = (await Database
          .raw('select count(*) as count,created_at from residences where created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            from,
            to,
          ]))[0],
        json     = {
          allFiles: allFiles,
          mandeFile: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          sellTransaction: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          rentTransaction: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          removed: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          onCheck: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          archived: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          sell: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          rent: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          occousion: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          video: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          toor: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          ladder: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
          important: [
            { count: Math.floor(Math.random() * 12), created_at: '2021-04-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-05-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-06-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-07-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-08-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-09-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-10-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-11-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2021-12-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-01-23' },
            { count: Math.floor(Math.random() * 12), created_at: '2022-02-23' },
          ],
        };
    // // console.log(allFiles);
    return response.json(json);
  }

  async find({ auth, response, request }) {
    const { id } = request.all();
    return response.json(await AdviserRealEstate.query().where('id', id).where('real_estate_id', auth.user.id).with(['Advisor']).last());
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
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules      = {
      fileUrl: 'required',
      firstname: 'required',
      lastname: 'required',
      mobile: 'required|unique:advisers ,mobile',
      email: 'required',
      password: 'required',
      type: 'required',
      male: 'required',
      count_file_rent: 'required',
      count_file_sell: 'required',
      count_occasion: 'required',
      count_instant: 'required',
      count_ladder: 'required',
      count_video: 'required',
      count_file_adviser: 'required',
      count_file_archive: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            fileUrl,
            firstname,
            lastname,
            mobile,
            email,
            password,
            type,
            male,
            count_file_rent,
            count_file_sell,
            count_occasion,
            count_instant,
            count_ladder,
            count_video,
            count_file_adviser,
            count_file_archive,
          }        = request.all();
    const {
            rule,
          }        = request.headers();
    let newAdviser = new Adviser();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newAdviser = await Adviser.query().where('id', request.body.id).last();
    }
    newAdviser.firstname = firstname;
    newAdviser.lastname  = lastname;
    newAdviser.email     = email;
    newAdviser.mobile    = mobile;
    newAdviser.password  = password;
    newAdviser.role      = type;
    newAdviser.lat       = 0;
    newAdviser.lng       = 0;
    newAdviser.address   = '';
    // newAdviser.active_code = Math.floor(Math.random() * 100000);
    newAdviser.avatar    = fileUrl;
    newAdviser.male      = male;
    let savedData        = await newAdviser.save();

    let newRealAdviserRealEstate = new AdviserRealEstate();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newRealAdviserRealEstate = await AdviserRealEstate.query()
        .where('adviser_id', newAdviser.id)
        .where('real_estate_id', auth.user.id)
        .last();
    }
    newRealAdviserRealEstate.real_estate_id     = auth.user.id;
    newRealAdviserRealEstate.adviser_id         = newAdviser.id;
    newRealAdviserRealEstate.count_file_rent    = count_file_rent;
    newRealAdviserRealEstate.count_file_sell    = count_file_sell;
    newRealAdviserRealEstate.count_occasion     = count_occasion;
    newRealAdviserRealEstate.count_instant      = count_instant;
    newRealAdviserRealEstate.count_ladder       = count_ladder;
    newRealAdviserRealEstate.count_video        = count_video;
    newRealAdviserRealEstate.count_file_adviser = count_file_adviser;
    newRealAdviserRealEstate.count_file_archive = count_file_archive;
    newRealAdviserRealEstate.status             = 0;
    await newRealAdviserRealEstate.save();
    return response.json({ status_code: 200, id: newRealAdviserRealEstate.id });
  }

  async address({ request, response, auth }) {
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules      = {
      id: 'required',
      address: 'required',
      lat: 'required',
      lng: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            address,
            id,
            lat,
            lng,
          }            = request.all();
    let newAdviser     = await Adviser.query().where('id', id).last();
    newAdviser.lat     = String(lat);
    newAdviser.lng     = String(lng);
    newAdviser.address = address;
    if (request.body.kartMeli && request.body.kartMeli !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.kart_meli = request.body.kartMeli;
    if (request.body.resome && request.body.resome !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.resome = request.body.resome;
    if (request.body.taeahodat && request.body.taeahodat !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.taeahodat = request.body.taeahodat;
    if (request.body.gharardad && request.body.gharardad !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.gharardad = request.body.gharardad;
    let savedData = await newAdviser.save();

    return response.json({ status_code: 200, id: newAdviser.id });
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

  async advisorDisableByRealestate({ request, response }) {
    let user     = await User.query().where('id', request.input('id')).last();
    user.disable = user.disable == 1 ? 0 : 1;
    await user.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetchAdvisorAdmin({ params, request, response }) {
    return response.json(await Adviser.query().where('advisor', 1).paginate());
  }

  async fetchRequestAdvisor({ auth, request, response }) {
    if (auth.user.is_advisor == 1)
      return response.json(await AdviserRealEstate.query().where('adviser_id', auth.user.id).where('status', 0).with('Realestate').with('Advisor').fetch());
    else if (auth.user.is_realestate == 1)
      return response.json(await AdviserRealEstate.query().where('real_estate_id', auth.user.id).where('status', 3).with('Realestate').with('Advisor').fetch());
  }

  async isExistAdvisor({ auth, request, response }) {
    let ad = await User.query()
      .where('firstname', request.input('firstname'))
      .where('lastname', request.input('lastname'))
      .where('mobile', request.input('mobile'))
      .fetch();
    // // console.log(ad);
    return response.json({ ex: ad.rows.length == 1 });
  }

  async codeRequest({ auth, request, response }) {
    let { id } = request.all();
    let re     = await AdviserRealEstate.query().where('id', id).where('adviser_id', auth.user.id).last();
    // // console.log(re.status);
    if (re.status == 0 || re.status == 3) {
      let code   = Math.floor(Math.random() * 999999);
      re.smsCode = code;
      await re.save();
      await new Sms().acceptAdvisor(code, auth.user.mobile);
      return response.json({ status_code: 200 });
    }
  }

  async isReqesutExistAdvisor({ auth, request, response }) {
    const {
            fileUrl,
            firstname,
            lastname,
            mobile,
            email,
            password,
            type,
            male,
            count_file_rent,
            count_file_sell,
            count_occasion,
            count_instant,
            count_ladder,
            count_video,
            count_file_adviser,
            count_file_archive,
          }                      = request.all();
    let newAdviser               = await Adviser.query()
      .where('firstname', request.input('firstname'))
      .where('lastname', request.input('lastname'))
      .where('mobile', request.input('mobile'))
      .last();
    let newRealAdviserRealEstate = new AdviserRealEstate();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newRealAdviserRealEstate = await AdviserRealEstate.query()
        .where('adviser_id', newAdviser.id)
        .where('real_estate_id', auth.user.id)
        .last();
    } else {
      newRealAdviserRealEstate.count_file_rent    = 0;
      newRealAdviserRealEstate.count_file_sell    = 0;
      newRealAdviserRealEstate.count_occasion     = 0;
      newRealAdviserRealEstate.count_instant      = 0;
      newRealAdviserRealEstate.count_ladder       = 0;
      newRealAdviserRealEstate.count_video        = 0;
      newRealAdviserRealEstate.count_file_adviser = 0;
      newRealAdviserRealEstate.count_file_archive = 0;
      newRealAdviserRealEstate.real_estate_id     = auth.user.id;
      newRealAdviserRealEstate.adviser_id         = newAdviser.id;
    }
    newRealAdviserRealEstate.status = 0;
    await newRealAdviserRealEstate.save();

    return response.json({ status_code: 200 });
  }

  async checkRequestCode({ auth, request, response }) {
    let { status, code, id } = request.all();
    let re                   = await AdviserRealEstate.query().where('id', id).where('adviser_id', auth.user.id).with('Realestate').last();
    let rea                  = await User.query().where('id', re.real_estate_id).last();
    if (re.status == 0) {
      if (status === 4) {
        if (re.smsCode == code) {
          re.status = 4;
          await re.save();
          // // console.log(rea.mobile);
          await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status === 5) {
        re.status = 5;
        await re.save();
        await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
      }
    } else if (re.status == 3) {
      if (status === 1) {
        if (re.smsCode == code) {
          re.status = 1;
          await re.save();
          // // console.log(rea.mobile);
          await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status === 2) {
        re.status = 2;
        await re.save();
        await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
      }
    } else {
      return response.json({ status_code: 401 });
    }
  }

  async deactiveAdviser({ auth, request, response }) {
    let {
          id,
        }      = request.all();
    let rea    = await User.query().where('id', id).last();
    rea.active = 0;
    rea.save();
    return response.json({ status_code: 200 });
  }

}

module.exports = AdvisorController;
