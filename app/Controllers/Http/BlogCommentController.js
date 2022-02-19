'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = require('@adonisjs/validator/src/Validator');
const BlogPost     = use('App/Models/BlogPost');
const BlogComment  = use('App/Models/BlogComment');

/**
 * Resourceful controller for interacting with blogcomments
 */
class BlogCommentController {
  /**
   * Show a list of all blogcomments.
   * GET blogcomments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { page } = request.qs;
    const limit    = 10;
    return response.json(await BlogComment.query().orderBy('id', 'desc').whereNotIn('active', [
      0,
      3,
    ]).where('user_posted', auth.user.id).with('userA').paginate(page, limit));
  }

  /**
   * Render a form to be used for creating a new blogcomment.
   * GET blogcomments/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      star: 'required',
      post_id: 'required',
      commentText: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          star,
          commentText,
          post_id,
        }            = request.all();
    let post         = await BlogPost.query().where('id', post_id).last();
    let newP         = new BlogComment();
    newP.star        = star;
    newP.user_posted = auth.user.id;
    newP.user_id     = post.user_id;
    newP.post_id     = post_id;
    newP.body        = commentText;
    await newP.save();
    let data = await newP;
    return response.json({ ...data.$attributes, status_code: 200 });
  }

  /**
   * Create/save a new blogcomment.
   * POST blogcomments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single blogcomment.
   * GET blogcomments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing blogcomment.
   * GET blogcomments/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update blogcomment details.
   * PUT or PATCH blogcomments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a blogcomment with id.
   * DELETE blogcomments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = BlogCommentController;
