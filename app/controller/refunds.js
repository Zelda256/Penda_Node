const Controller = require('egg').Controller;

class RefundsController extends Controller {
  async create() {
    const { ctx } = this;
    const { refunds } = this.service;
    const result = await refunds.create();
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
  async list() {

  }
  async readByProjectId() {
    const { ctx } = this;
    const { refundAmount } = this.service;
    console.log('??????????????????????');
    const result = await refundAmount.readByProjectId(ctx.params.id);
    ctx.body = {
      status: 1,
      data: result,
      msg: null
    };
  }
}

module.exports = RefundsController;