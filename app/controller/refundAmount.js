const Controller = require('egg').Controller;

class RefundAmountController extends Controller {
  async create() {
    const { ctx } = this;
    const { refundAmount } = this.service;
    const result = await refundAmount.create(ctx.params.id);
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

module.exports = RefundAmountController;