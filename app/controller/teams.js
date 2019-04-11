const Controller = require('egg').Controller;

class TeamsController extends Controller {
  async create() {
    const { ctx } = this;
    const { teams } = this.service;
    const result = await teams.create();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async list() {
    const { ctx } = this;
    const { teams } = this.service;
    const result = await teams.list();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }

}

module.exports = TeamsController;