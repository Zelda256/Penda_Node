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

    const query = {
      projectId: { $in: projectIdArr },
    };
    if (type) query.type = type;

    const refunds = await Refunds.find(query)
      .populate('userId', 'name')
      .populate('projectId', 'name')
      .populate('processId', 'name');

    return refunds;
  }
  async readByProjectId(projectId) {
    const { ctx } = this;
    const { RefundAmount } = ctx.model;

    // console.log('readByProjectId', projectId);
    return await RefundAmount.findOne({ projectId });
  }

  async listSummary(projectId) {
    const refunds = await this.list(projectId);
    // console.log('refunds?? ', refunds);
    const results = [];
    if (!refunds || !refunds.length) return;
    refunds.forEach(refundItem => {
      const projectId = refundItem.projectId._id;
      const userId = refundItem.userId._id;
      // 找到报销汇总中对应的项目
      const project = results.find(item => item.project._id === projectId);
      if (!project) {
        results.push({
          project: refundItem.projectId,
          summary: [{
            user: refundItem.userId,
            refunds: [{
              type: refundItem.type,
              value: refundItem.value
            }]
          }]
        });
      } else {
        // 找到对应的用户的汇总
        const userSummary = project.summary.find(item => item.user._id === userId);
        if (!userSummary) {
          project.summary.push({
            user: refundItem.userId,
            refunds: [{
              type: refundItem.type,
              value: refundItem.value
            }]
          });
        } else {
          // 找到汇总中对应的报销类型
          const userRefund = userSummary.refunds.find(item => item.type === refundItem.type);
          if (!userRefund) {
            userSummary.refunds.push({
              type: refundItem.type,
              value: refundItem.value
            });
          } else {
            userRefund.value += refundItem.value;
          }
        }
      }
    });
    // console.log('results ????', results);
    return results;
  }
}

module.exports = RefundsService;