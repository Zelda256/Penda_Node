const Service = require('egg').Service;
const download = require('./utils/download');
const moment = require('moment');

class RefundsService extends Service {
  async create() {
    const { ctx } = this;
    const { Refunds } = ctx.model;
    const { process, projects, refundAmount } = ctx.service;
    const item = ctx.request.body;
    // console.log('create refund item', item);
    const refund = new Refunds(item);
    const result = await refund.save();
    // console.log(result);

    // 更新子任务花销
    const procUpdate = await process.updateCostById(item.processId, item.value);
    // console.log('create procUpdate', procUpdate);

    // 更新项目总剩余额度
    const projUpdate = await projects.updateLeftBudget(item.projectId, item.value);
    // console.log('create projUpdate', projUpdate);

    // 更新预算限额
    const refundAmountUpdate = await refundAmount.updateByProjectId(item.projectId, item.type, item.value);
    // console.log('create refundAmountUpdate', refundAmountUpdate);

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
      projectObjArr = await Projects.find({ _id: projectId }, '_id budget').populate('creator', 'name');
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
    console.log('refunds?? ', refunds);
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
    // console.log('refunds refunds refunds', refunds);
    // console.log('processes processes processes', processes);

    refunds.forEach(refund => {
      const { type, value } = refund;

      const result = results.find(res => String(res._id) === String(refund.processId));
      const process = processes.find(proc => String(proc._id) === String(refund.processId));
      if (!result) { // 如果当前报销记录的子任务未曾出现在决算表中
        results.push({
          _id: refund.processId,
          name: process.name,
          budge: process.budge ? process.budge : 0,
          cost: process.cost ? process.cost : 0,
          account: [{
            type,
            value
          }],
        });
      } else { // 如果当前报销记录的子任务已出现在决算表中，则更新一个account或account中的value
        if (result.account.find(act => act.type === type)) {
          // console.log('11111111111');
          result.account = result.account.map(act => {
            if (act.type === type) {
              act.value += value;
            }
          }
          );
        } else {
          // console.log('222222222');
          result.account.push({
            type,
            value
          });
        }
      }
    });
    return results;
  }

  async downloadSummary(projectId) {
    const { ctx } = this;
    const projSummary = await this.listSummary(projectId);
    // console.log(projSummary);
    const projectName = projSummary[0].project.name;
    // console.log(projectName);
    const summary = projSummary[0].summary;
    const excelData = [['姓名', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费', '合计']];
    let allTotal = 0;
    let feeTotal = [0, 0, 0, 0, 0, 0, 0];
    summary.forEach(sum => {
      const data = [sum.user.name, '', '', '', '', '', ''];
      let rowTotal = 0;
      sum.refunds.forEach(refund => {
        data[refund.type] = refund.value;
        feeTotal[refund.type] += refund.value;
        rowTotal += refund.value;
      });
      allTotal += rowTotal;
      data.push(rowTotal);
      excelData.push(data);
    });
    let lastRow = `合计(${allTotal}元)： 1.差旅费：${feeTotal[1]}元; 2.材料费：${feeTotal[2]}元; 3.文献出版费：${feeTotal[3]}元; 4.劳务费：${feeTotal[4]}元; 5.专家咨询费：${feeTotal[5]}元; 6.设备费：${feeTotal[6]}元;`;
    excelData.push([lastRow]);
    const fileName = projectName + '_报销汇总表.xlsx';
    const fileOptions = {
      '!cols': [{ wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }],
      '!merges': [{ s: { c: 0, r: excelData.length - 1 }, e: { c: 7, r: excelData.length - 1 } }],
    };
    download.exportExcel(ctx, excelData, fileName, fileOptions);
    return excelData;
  }

  async downloadRefund(projectId, type) {
    const { ctx } = this;
    const refunds = await this.list(projectId, type);
    const excelData = [['项目名称', '任务名称', '报销日期', '报销类型', '报销人', '报销金额']];
    refunds.forEach(refund => {
      let date = moment(refund.date).format('YYYY-MM-DD');
      let type = '';
      switch (refund.type) {
      case 1: type = '差旅费'; break;
      case 2: type = '材料费'; break;
      case 3: type = '文献出版费'; break;
      case 4: type = '劳务费'; break;
      case 5: type = '专家咨询费'; break;
      case 6: type = '设备费'; break;
      }
      const data = [refund.projectId.name, refund.processId.name, date, type, refund.userId.name, refund.value];
      excelData.push(data);
    });
    const fileName = '报销汇总表.xlsx';
    const fileOptions = { '!cols': [{ wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 12 }] };
    download.exportExcel(ctx, excelData, fileName, fileOptions);
  }

  async downloadAccount(projectId) {
    const { ctx } = this;
    const { Projects } = ctx.model;
    const accounts = await this.readAccount(projectId);
    const project = await Projects.findById(projectId).populate('creator');
    let firstRow = `项目名称：${project.name}    项目负责人：${project.creator.name}    项目总预算：${project.budget}    金额单位：元`;
    const excelData = [[firstRow],
      ['序号', '任务名称', '预算数', '累计支出', '支出情况'],
      ['', '', '', '', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费', '决算数']
    ];
    const fileOptions = {
      '!cols': [{ wch: 8 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }],
      '!merges': [
        { s: { c: 0, r: 0 }, e: { c: 10, r: 0 } },

        { s: { c: 4, r: 1 }, e: { c: 9, r: 1 } },
        // { s: { c: 10, r: 1 }, e: { c: 10, r: 2 } },
        { s: { c: 0, r: 1 }, e: { c: 0, r: 2 } },
        { s: { c: 1, r: 1 }, e: { c: 1, r: 2 } },
        { s: { c: 2, r: 1 }, e: { c: 2, r: 2 } },
        { s: { c: 3, r: 1 }, e: { c: 3, r: 2 } },
      ],
    };
    let index = 1;
    accounts.forEach(acnt => {
      let data = [index, acnt.name, acnt.budge, acnt.cost];
      index++;
      let refundData = [0, 0, 0, 0, 0, 0, acnt.budge - acnt.cost];
      acnt.account.forEach(item => {
        refundData[item.type - 1] += item.value;
      });
      // console.log(refundData);
      data.push(...refundData);
      // data.push(acnt.budge - acnt.cost);
      excelData.push(data);
    });
    // console.log(excelData);
    const fileName = project.name + '_项目决算表.xlsx';
    download.exportExcel(ctx, excelData, fileName, fileOptions);
    // return excelData;
  }
}

module.exports = RefundsService;