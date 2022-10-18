'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const SaveRequest           = use('App/Models/SaveRequest');
const SaveRequestRealestate = use('App/Models/SaveRequestRealestate');
const { validate }          = use('Validator');
const Env                   = use('Env');
const ZarinpalCheckout      = require('zarinpal-checkout');
const { randomNum }         = require('../Helper');
const zarinpal              = ZarinpalCheckout.create(Env.get('ZARINPAL_MERCHANT_KEY'), false);

/**
 * Resourceful controller for interacting with saverequests
 */
class SaveRequestController {
  async index({ request, response, auth }) {
    return response.json(await SaveRequest.query().with('option').with('RTO2').with('RTO3').where('user_id', auth.user.id).fetch());
  }

  async indexLoadType3s({ request, response, auth }) {
    let { type } = request.params;
    return response.json(await SaveRequest.query().with('option').with('RTO2').with('RTO3').where('user_id', auth.user.id).where('type', type).fetch());
  }

  async indexReal({ request, response, auth }) {
    let arr = [];
    let RSQ = await SaveRequestRealestate.query().where('user_id', 50).fetch();
    // let RSQ = await SaveRequestRealestate.query().where('user_id', auth.user.id).fetch();
    for (let rsqElement of RSQ.rows) {
      arr.push(rsqElement.request_id);
    }
    return response.json(await SaveRequest.query().whereIn('id', arr).with('option').with('RTO2').with('RTO3').fetch());
  }

  /**
   * Render a form to be used for creating a new transaction.
   * GET transactions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async sendPayment({ request, response, view }) {
    let {
          slug,
        } = request.params;
    let {
          price_carshenas,
          description,
          status,
        } = await SaveRequest.query().where('slug', slug).last();
    if (status !== 3)
      return response.send('payed before');
    let resp = await zarinpal.PaymentRequest({
      Amount: price_carshenas, // In Tomans
      CallbackURL: `${Env.get('APP_URL')}/api/user/request/payment/get/${slug}`,
      Description: description,
    });
    if (resp.status === 100) {
      let transaction   = await SaveRequest.query().where('slug', slug).last();
      transaction.ref_1 = resp.authority;
      transaction.save();

      return response.redirect(resp.url);
    }
  }

  /**
   * Create/save a new transaction.
   * POST transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async getPayment({ request, response }) {
    let { slug }      = request.params;
    let { Authority } = request.get();
    let {
          id,
          ref_1,
          ref_3,
          user_id,
          price_carshenas,
        }             = await SaveRequest.query().where('slug', slug).last();
    let resp          = await zarinpal.PaymentVerification({
      Amount: price_carshenas, // In Tomans
      Authority: ref_1,
    });
    if (resp.status !== 100) {
      return response.redirect(`${Env.get('VIEW_URL')}/pay/unsuccess`);
    } else {
      let transaction    = await SaveRequest.query().where('slug', slug).last();
      transaction.status = 4;
      transaction.ref_2  = resp.RefID;
      transaction.save();
      return response.redirect(`${Env.get('VIEW_URL')}/pay/success`);
    }
  }

  async create({ request, response, auth }) {
    const rules      = {
      type: 'required',
      name: 'required',
      zaman_bazdid: 'required',
      zaman_karshenasi: 'required',
      metrazh: 'required',
      title: 'required',
      description: 'required',
      address: 'required',
      mobile: 'required',
      ax: 'required',
      sanad: 'required',
      cartmeli: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            type,
            name,
            zaman_bazdid,
            zaman_karshenasi,
            metrazh,
            title,
            description,
            address,
            mobile,
            ax,
            sanad,
            cartmeli,
          }                      = request.all();
    const { rule }               = request.headers();
    const user                   = auth.user;
    let newReq                   = new SaveRequest();
    newReq.slug                  = randomNum(12);
    newReq.user_id               = user.id;
    newReq.type                  = type;
    newReq.name                  = name;
    newReq.zaman_bazdid          = zaman_bazdid;
    newReq.zaman_tamas_karshenas = zaman_karshenasi;
    newReq.metrazh               = metrazh;
    newReq.title                 = title;
    newReq.description           = description;
    newReq.address               = address;
    newReq.mobile                = mobile;
    newReq.ax                    = ax;
    newReq.sanad                 = sanad;
    newReq.cartmeli              = cartmeli;
    if (type == 3) {
      const rules2      = {
        // area: 'required',
        price: 'required',

      };
      const validation2 = await validate(request.all(), rules2);
      if (validation2.fails()) {
        return response.json(validation2.messages());
      }
      const {
              price,
            }      = request.all();
      newReq.price = price;

    } else {
      const rules3      = {
        rto_1: 'required',
        rto_2: 'required',
        age: 'required',
        lat: 'required',
        lng: 'required',
        arz: 'required',
        tool: 'required',

      };
      const validation3 = await validate(request.all(), rules3);
      if (validation3.fails()) {
        return response.json(validation3.messages());
      }
      const {
              age,
              lat,
              lng,
              rto_1,
              rto_2,
              arz,
              tool,
            }        = request.all();
      newReq.metrazh = metrazh;
      newReq.age     = age;
      newReq.lat     = lat;
      newReq.lng     = lng;
      newReq.rto_2   = rto_1;
      newReq.rto_3   = rto_2;
      newReq.arz     = arz;
      newReq.tool    = tool;
    }
    await newReq.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SaveRequestController;
