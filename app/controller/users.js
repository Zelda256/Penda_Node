const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const { users } = this.service;
    const result = await users.create();
    ctx.body = result;
  }
  async list() {
    const { ctx } = this;
    const { users } = this.service;
    const result = await users.list();
    ctx.body = result;
  }
  async read() {
    const { ctx } = this;
    ctx.body = 'hw';
  }
}

module.exports = UserController;