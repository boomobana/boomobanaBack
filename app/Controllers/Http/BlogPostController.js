'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }     = require('@adonisjs/validator/src/Validator'),
      BlogCategory     = use('App/Models/BlogCategory'),
      BlogCategoryPost = use('App/Models/BlogCategoryPost'),
      BlogPost         = use('App/Models/BlogPost');

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
    const { page } = request.qs;
    const limit    = 10;
    let data       = BlogPost.query()
      .orderBy('id', 'desc')
      .with('user')
      .with('comment')
      .where('active', 1);
    if (request.body.type === 'tag') {

    } else if (request.body.type === 'cat') {
      let catsArr    = [];
      let subCatsArr = [];
      let cats;
      let SubCats;
      let SubCat     = await BlogCategory.query().where('id', request.body.id).last();
      if (SubCat.sub_cat == 0) {
        SubCats = await BlogCategory.query().where('sub_cat', request.body.id).fetch();
        for (let cat in SubCats.rows) {
          subCatsArr.push(SubCats.rows[cat].id);
        }
      } else {
        subCatsArr.push(SubCat.id);
      }
      // // console.log(subCatsArr);
      cats = await BlogCategoryPost.query().whereIn('category_id', subCatsArr).fetch();
      for (let cat in cats.rows) {
        catsArr.push(cats.rows[cat].post_id);
      }
      data.whereIn('id', catsArr);
    }
    return response.json(await data.paginate(page, limit));
  }

  async indexMy({ request, response, auth }) {
    return response.json(await BlogPost.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('comment')
      .orderBy('id', 'desc')
      .fetch());
  }

  async categoryFetch({ request, response, auth }) {
    return response.json(await BlogCategory.query()
      .orderBy('id', 'desc')
      .fetch());
  }

  async categoryPostFetch({ request, response, auth }) {
    return response.json(await BlogCategoryPost.query()
      .where('category_id', request.body.category_id)
      .orderBy('id', 'desc')
      .fetch());
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
    return response.json(await BlogPost
      .query()
      .with('user')
      .with('comment')
      .where('slug', request.body.slug)
      .first());
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
