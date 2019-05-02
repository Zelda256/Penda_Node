const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async create() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.create();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async list() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.list();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async listName() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.listName();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async read() {
    const { ctx } = this;
    const { projects } = this.service;
    const result = await projects.read(ctx.params.id);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
}

module.exports = ProjectController;