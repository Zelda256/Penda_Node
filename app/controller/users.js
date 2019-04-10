const Controller = require('egg').Controller;

class UserController extends Controller {
  async logout() {
    const {ctx} = this;
    ctx.logout();
    ctx.redirect(ctx.get('referer') || '/');
  }
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
  async read() {
    const { ctx } = this;
    ctx.body = 'hw';
  }
}

module.exports = UserController;