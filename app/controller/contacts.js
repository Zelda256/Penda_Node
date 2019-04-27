const Controller = require('egg').Controller;

class ContactsController extends Controller {
  async create() {  // create
    const { ctx } = this;
    const { contacts } = this.service;
    const result = await contacts.create(ctx.params.id);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async addToContactById() {  // create
    const { ctx } = this;
    const { contacts } = this.service;
    const result = await contacts.addToContactById(ctx.params.id);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async listByUserId() {
    const { ctx } = this;
    const { contacts } = this.service;
    const result = await contacts.listByUserId();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async deleteContactById() {
    const { ctx } = this;
    const { contacts } = this.service;
    const result = await contacts.deleteContactById(ctx.params.id);
    if (result === 0) {
      ctx.body = {
        status: 0,
        msg: null
      };
    }
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }

}

module.exports = ContactsController;