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

  async list(projectId, type) {
    const { ctx } = this;
    const { Refunds, Projects } = ctx.model;
    // 所有项目
    const curUser = ctx.user;
    if (!curUser) return 0;
    const teams = curUser.teams;
    const projectIdArr = [];
    if (!projectId) {
      const projectObjArr = await Projects.find({ team: { $in: teams } }, '_id');
      projectObjArr.forEach(item => projectIdArr.push(item._id));
    } else {
      projectIdArr.push(projectId);
    }

    console.log('list refunds : projectIdArr', projectIdArr);
    // if (!type) type = undefined;
    const query = {
      projectId: { $in: projectIdArr },
    };
    if (type) query.type = type;

    const refunds = await Refunds.find(query)
      .populate('userId', 'name')
      .populate('projectId', 'name')
      .populate('processId', 'name');

    // refunds.projectObjArr = projectObjArr;
    return refunds;
  }
  async readByProjectId(projectId) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;

    console.log('readByProjectId', projectId);
    return await RefundAmount.findOne({ projectId });
  }

  async listSummary() {
    return await this.list();
  }
}

module.exports = RefundsService;