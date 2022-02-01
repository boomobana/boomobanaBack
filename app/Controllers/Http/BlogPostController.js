'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = require('@adonisjs/validator/src/Validator');
const BlogComment  = use('App/Models/BlogComment');
const BlogPost     = use('App/Models/BlogPost');

/**
 * Resourceful controller for interacting with blogposts
 */
class BlogPostController {
  /**
   * Show a list of all blogposts.
   * GET blogposts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {
    return response.json(await BlogPost.query().orderBy('id', 'desc').fetch());
  }

  async indexMy({ request, response, auth }) {
    return response.json(await BlogPost.query().where('user_id', auth.user.id).orderBy('id', 'desc').fetch());
  }

  /**
   * Render a form to be used for creating a new blogpost.
   * GET blogposts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      title: 'required',
      body: 'required',
      body_more: 'required',
      active: 'required',
      price: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          title,
          body,
          body_more,
          active,
          price,
        }          = request.all();
    let slug       = Math.floor(Math.random() * 999999999999) + '-' + Math.floor(Math.random() * 999999999999) + '-' + Math.floor(Math.random() * 999999999999);
    let newP       = new BlogPost();
    newP.slug      = slug;
    newP.user_id   = auth.user.id;
    newP.title     = title;
    newP.body      = body;
    newP.body_more = body_more;
    newP.active    = active;
    newP.price     = price;
    await newP.save();
    let data = await newP;
    return response.json({ ...data.$attributes, status_code: 200 });
  }

  /**
   * Create/save a new blogpost.
   * POST blogposts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single blogpost.
   * GET blogposts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ request, response }) {
    return response.json(await BlogPost.query().where('slug', request.body.slug).first());
  }

  /**
   * Render a form to update an existing blogpost.
   * GET blogposts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update blogpost details.
   * PUT or PATCH blogposts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a blogpost with id.
   * DELETE blogposts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    await BlogPost.query().where('slug', request.body.slug).delete();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = BlogPostController;
