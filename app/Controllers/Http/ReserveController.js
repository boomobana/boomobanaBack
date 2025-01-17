'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Residence        = use('App/Models/Residence');
const Reserved         = use('App/Models/Reserved');
const Env              = use('Env');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal         = ZarinpalCheckout.create(Env.get('ZARINPAL_MERCHANT_KEY'), true);
const {
        randomNum,
        makeidF, changeAmount,
      }                = require('../Helper');

/**
 * Resourceful controller for interacting with regions
 */
class ReserveController {
  /**
   * Show a list of all regions.
   * GET regions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await Reserved.query().with('Residence').where('user_id', auth.user.id).where('status', 1).fetch());
  }

  async indexBy({ request, response, auth }) {
    const { rule } = request.headers();
    return response.json(await Reserved.query().with('Residence', q => {
      q.where('user_id', auth.user.id);
    }).where('status', 1).fetch());
  }

  /**
   * Render a form to be used for creating a new region.
   * GET regions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const { rule } = request.headers();
    const {
            residence_id,
            start_time,
            end_time,
            count_user,
          }        = request.all();
    let slug       = makeidF(16),
        res        = await Residence.query()
          .with('Season')
          .where('id', residence_id)
          .last(),
        timeSt     = start_time.split('/'),
        timeEn     = end_time.split('/'),
        day1       = parseInt(timeSt[2]),
        day2       = parseInt(timeEn[2]),
        days       = 0;
    if (parseInt(timeEn[1]) > parseInt(timeSt[1])) {
      day2 = day2 + ((timeEn[1] - timeSt[1]) * 30);
    }
    days                    = day2 - day1;
    let price               = parseInt(res.$relations.Season.rows[0].price) * days;
    const ReserveS          = new Reserved();
    ReserveS.user_id        = auth.user.id;
    ReserveS.residence_id   = residence_id;
    ReserveS.start_time     = start_time;
    ReserveS.end_time       = end_time;
    ReserveS.count_user     = count_user;
    ReserveS.price          = price;
    ReserveS.transaction_id = randomNum(6);
    ReserveS.slug           = slug;
    await ReserveS.save();
    let link = `${Env.get('PAYMENT_URL')}/api/user/reserve/residence/send/${slug}`;
    return response.json({ status_code: 200, status_text: 'Successfully Done', link: `${link}` });
  }

  async sendPayment({ request, response }) {
    let {
          slug,
        }    = request.params;
    let {
          price,
          status,
        }    = await Reserved.query().where('slug', slug).last();
    let resp = await zarinpal.PaymentRequest({
      Amount: price, // In Tomans
      CallbackURL: `${Env.get('PAYMENT_URL')}/api/user/reserve/residence/get/${slug}`,
      Description: 'رزرو اقامتگاه در بوم و بنا',
    });
    if (resp.status === 100) {
      let transaction   = await Reserved.query().where('slug', slug).last();
      transaction.ref_1 = resp.authority;
      transaction.save();

      return response.redirect(resp.url);
    }
  }

  async getPayment({ request, response }) {
    let { slug }      = request.params;
    let { Authority } = request.get();
    let resx          = await Reserved.query().where('slug', slug).last();
    let resp          = await zarinpal.PaymentVerification({
      Amount: resx.price, // In Tomans
      Authority: resx.ref_1,
    });
    if (resp.status !== 100) {
      return response.redirect(`${Env.get('VIEW_URL')}/pay/unsuccess`);
    } else {
      resx.status = 1;
      resx.ref_2  = resp.RefID;
      await resx.save();
      return response.redirect(`${Env.get('VIEW_URL')}/pay/success`);
    }
  }

  /**
   * Create/save a new region.
   * POST regions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single region.
   * GET regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing region.
   * GET regions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update region details.
   * PUT or PATCH regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a region with id.
   * DELETE regions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ReserveController;
