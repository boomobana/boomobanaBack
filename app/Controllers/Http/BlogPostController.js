'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }     = require('@adonisjs/validator/src/Validator'),
      BlogCategory     = use('App/Models/BlogCategory'),
      BlogCategoryPost = use('App/Models/BlogCategoryPost'),
      BlogFile         = use('App/Models/BlogFile'),
      BlogPost         = use('App/Models/BlogPost');
const { makeidF }      = require('../Helper');

/**
 * Resourceful controller for interacting with blogposts
 */
class BlogPostController {
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
    let slug       = makeidF(20);
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

  async store({ request, response }) {
  }

  async show({ request, response }) {
    return response.json(await BlogPost
      .query()
      .with('user')
      .with('comment')
      .where('slug', request.body.slug)
      .first());
  }

  async destroy({ params, request, response }) {
    await BlogPost.query().where('slug', request.body.slug).delete();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async indexAdmin({ request, response }) {
    const { page } = request.qs;
    const limit    = 10;
    let data       = BlogPost.query()
      .orderBy('id', 'desc')
      .with('user')
      .with('comment')
      .with('category');
    return response.json(await data.paginate(page, limit));
  }

  async findAdmin({ request, response }) {
    let data = BlogPost.query()
      .where('id', request.body.id)
      .with('user')
      .with('comment')
      .with('category');
    return response.json(await data.last());
  }

  async createPostAdmin({ request, response }) {
    let blg;
    if (request.body.id != undefined && request.body.id != null && request.body.id != 0 && request.body.id != '') {
      await BlogPost.query().where('id', request.body.id).update(request.body);
      blg = await BlogPost.query().where('id', request.body.id).last();
    } else {
      blg = await BlogPost.create(request.body);
    }
    return response.json({ status_code: 200, id: blg });
  }

  async createPostCategoryAdmin({ request, response }) {
    if (request.body.id != undefined && request.body.id != null && request.body.id != 0 && request.body.id != '') {
      await BlogCategoryPost.query().where('id', request.body.id).update(request.body);
    } else {
      await BlogCategoryPost.create(request.body);
    }
    return response.json({ status_code: 200 });
  }

  async createPostFileAdmin({ request, response }) {
    if (request.body.id != undefined && request.body.id != null && request.body.id != 0 && request.body.id != '') {
      await BlogFile.query().where('id', request.body.id).update(request.body);
    } else {
      await BlogFile.create(request.body);
    }
    return response.json({ status_code: 200 });
  }

  async createCategoryAdmin({ request, response }) {
    if (request.body.id != undefined && request.body.id != null && request.body.id != 0 && request.body.id != '') {
      await BlogCategory.query().where('id', request.body.id).update(request.body);
    } else {
      await BlogCategory.create(request.body);
    }
    return response.json({ status_code: 200 });
  }

  async fetchCategoryAdmin({ request, response }) {
    const { page } = request.qs;
    const limit    = 10;

    let data = BlogCategory.query().with('sub');
    if (page != '-1')
      return response.json(await data.paginate(page, limit));
    else
      return response.json(await data.fetch());

  }

  async findCategoryAdmin({ request, response }) {
    return response.json(await BlogCategory.query().with('sub').where('id', request.body.id).last());
  }
}

module.exports = BlogPostController;
