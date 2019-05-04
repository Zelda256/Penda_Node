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
    let projectObjArr = null;
    if (!projectId) {
      projectObjArr = await Projects.find({ team: { $in: teams } }, '_id budget').populate('creator', 'name');
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

    // console.log(projectObjArr);
    const results = [];
    refunds.forEach(item => {

      let tmpResult = item;
      const proj = projectObjArr.find(proj => String(proj._id) === String(item.projectId._id));
      // console.log('98744  proj',proj);
      tmpResult.projectId.budget = proj.budget ? proj.budget : 0;
      tmpResult.projectId.creator = proj.creator;
      // projectObjArr.find(proj => console.log(proj._id));
      results.push(tmpResult);

    });
    // console.log(results);
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
              value: refundItem.value,
              processId: refundItem.processId._id,
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
              value: refundItem.value,
              processId: refundItem.processId._id,
            }]
          });
        } else {
          // 找到汇总中对应的报销类型
          const userRefund = userSummary.refunds.find(item => item.type === refundItem.type);
          if (!userRefund) {
            userSummary.refunds.push({
              type: refundItem.type,
              value: refundItem.value,
              processId: refundItem.processId._id,
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

  async readAccount(projectId) {
    const { ctx } = this;
    const { Projects, Process, Refunds } = ctx.model;
    // const result = await this.listSummary(projectId);
    const project = await Projects.findById(projectId, 'process');
    const processIdArr = project.process;
    const results = [];
    const processes = await Process.find({ _id: { $in: processIdArr } }, 'name budge cost');
    const refunds = await Refunds.find({ projectId }, 'processId type value');
    console.log(refunds);
    processes.forEach(process => {
      const { _id, name, budge, cost } = process;
      let refund = refunds.find(rfd => String(rfd.processId) === String(_id));
      console.log('refund', refund);
      if (refund) {
        const { type, value } = refund;
        let result = results.find(rlt => String(rlt._id) === String(_id));
        if (!result) {
          results.push({
            _id,
            name,
            budge: budge ? budge : 0,
            cost: cost ? cost : 0,
            account: [{
              type,
              value
            }],
          });
        } else {
          result.account.value += value;
        }
      }
    });
    return results;
  }
}

module.exports = RefundsService;