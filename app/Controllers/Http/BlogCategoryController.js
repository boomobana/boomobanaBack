'use strict';
const BlogCategory = use('App/Models/BlogCategory');

class BlogCategoryController {
  async index({ response }) {
    return response.json(await BlogCategory.query().fetch());
  }
}

module.exports = BlogCategoryController;
