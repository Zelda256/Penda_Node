const Controller = require('egg').Controller;

class TeamsController extends Controller {
  async create() {
    const { ctx } = this;
    const { users } = this.service;
    const result = await users.create();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async list() {
    const { ctx } = this;
    const { users } = this.service;
    const result = await users.list();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }

}

module.exports = TeamsController;