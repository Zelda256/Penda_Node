const Service = require('egg').Service;

class RefundAmountService extends Service {
  async create(projectId) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;
    // const { RefundAmount } = this.service;
    const item = ctx.request.body;
    item.projectId = projectId;
    item.leftTravel = item.maxTravel;
    item.leftStuff = item.maxStuff;
    item.leftLabor = item.maxLabor;
    item.leftPublish = item.maxPublish;
    item.leftConsult = item.maxConsult;
    item.leftDevice = item.maxDevice;

    const refundAmount = new RefundAmount(item);
    return await refundAmount.save();

  }

  async list() {

  }
  async readByProjectId(projectId) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;
    console.log('readByProjectId', projectId);
    return await RefundAmount.findOne({ projectId });
  }

  async updateByProjectId(projectId, type, costValue) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;
    const refundAmount = await this.readByProjectId(projectId);
    console.log('^%$@#%^&%$#@!',type, costValue, refundAmount);
    switch (type) {
    case 1: {
      refundAmount.leftTravel -= costValue;
      break;
    }
    case 2: {
      refundAmount.leftStuff -= costValue;
      break;
    }
    case 3: {
      refundAmount.leftPublish -= costValue;
      break;
    }
    case 4: {
      refundAmount.leftLabor -= costValue;
      break;
    }
    case 5: {
      refundAmount.leftConsult -= costValue;
      break;
    }
    case 6: {
      refundAmount.leftDevice -= costValue;
      break;
    }
    default: break;
    }
    return await RefundAmount.updateOne({ projectId }, {
      leftTravel: refundAmount.leftTravel,
      leftStuff: refundAmount.leftStuff,
      leftPublish: refundAmount.leftPublish,
      leftLabor: refundAmount.leftLabor,
      leftConsult: refundAmount.leftConsult,
      leftDevice: refundAmount.leftDevice,
    });
  }
}

module.exports = RefundAmountService;