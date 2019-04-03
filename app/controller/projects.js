const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async create() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.create();
    ctx.body = result;
  }
  async list() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.list();
    ctx.body = result;
  }
}

module.exports = ProjectController;