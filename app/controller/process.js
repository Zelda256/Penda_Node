const Controller = require('egg').Controller;

class ProcessController extends Controller {
  async create() {
    console.log('?451254212');
    const { ctx } = this;
    const { process } = this.service;
    const result = await process.create();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async list() {
    const { ctx } = this;
    const { process } = this.service;
    const projectId = ctx.params.projectId;
    console.log('projectId', projectId);
    const result = await process.list(projectId);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async read() {

  }
  async updateStatus() {
    const { ctx } = this;
    const { process } = this.service;
    const result = await process.updateStatus(ctx.params.id);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
}

module.exports = ProcessController;