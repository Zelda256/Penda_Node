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
    const { ctx } = this;
    const { refunds } = this.service;
    const { projectId, type } = ctx.query;
    const result = await refunds.list(projectId, type);
    if (!result) {
      ctx.body = {
        status: 0,
        msg: null
      };
    } else {
      ctx.body = {
        status: 1,
        data: result,
        msg: null
      };
    }
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

  async listSummary() {
    const { ctx } = this;
    const { refunds } = this.service;
    const { projectId } = ctx.query;
    const result = await refunds.listSummary(projectId);
    if (!result) {
      ctx.body = {
        status: 0,
        msg: null
      };
    } else {
      ctx.body = {
        status: 1,
        data: result,
        msg: null
      };
    }
  }

  async readAccount() {
    const { ctx } = this;
    const { refunds } = this.service;
    const projectId = ctx.params.id;
    const result = await refunds.readAccount(projectId);
    if (!result) {
      ctx.body = {
        status: 0,
        msg: null
      };
    } else {
      ctx.body = {
        status: 1,
        data: result,
        msg: null
      };
    }
  }
}

module.exports = RefundsController;