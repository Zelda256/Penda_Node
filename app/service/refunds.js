const Service = require('egg').Service;

class RefundsService extends Service {
  async create() {
    const { ctx } = this;
    const { Refunds } = ctx.model;
    const { process, projects, refundAmount } = ctx.service;
    const item = ctx.request.body;
    console.log('create refund item', item);
    const refund = new Refunds(item);
    const result = await refund.save();

    // 更新子任务花销
    const procUpdate = await process.updateCostById(item.processId, item.value);
    console.log('create procUpdate', procUpdate);

    // 更新项目总剩余额度
    const projUpdate = await projects.updateLeftBudget(item.projectId, item.value);
    console.log('create projUpdate', projUpdate);

    // 更新预算限额
    const refundAmountUpdate = await refundAmount.updateByProjectId(item.projectId, item.type, item.value);
    console.log('create refundAmountUpdate', refundAmountUpdate);

    return result;
  }

  async list() {
    const { ctx } = this;
    const { Refunds, Projects } = ctx.model;
    // 所有项目
    const curUser = ctx.user;
    if (!curUser) return 0;
    const teams = curUser.teams;
    const projectObjArr = await Projects.find({ team: { $in: teams } }, '_id');
    const projectIdArr = [];
    projectObjArr.forEach(item => projectIdArr.push(item._id));
    console.log('list refunds : projectIdArr', projectIdArr);

    const refunds = await Refunds.find({ projectId: { $in: projectIdArr } })
      .populate('userId', 'name')
      .populate('projectId', 'name')
      .populate('processId', 'name');
    return refunds;
  }
  async readByProjectId(projectId) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;

    console.log('readByProjectId', projectId);
    return await RefundAmount.findOne({ projectId });
  }
}

module.exports = RefundsService;