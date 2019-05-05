const Service = require('egg').Service;

class ProcessService extends Service {
  async create() {
    const { ctx } = this;
    const { Process, Projects } = ctx.model;
    const { projects } = this.service;
    const item = ctx.request.body;
    // console.log('item', item);
    item.budge = item.budge ? item.budge : 0;
    item.cost = 0;
    const projectId = ctx.params.id;
    let finishCnt = 0;
    if (item.status === 3) finishCnt += 1;

    // 创建process对象
    const process = new Process(item);
    const result = await process.save();
    // console.log('ressssss', result);
    // 找到对应project
    const project = await projects.read(projectId);
    project.process.forEach(process => {
      // console.log('process：', process._id);
      if (process.status === 3) { finishCnt += 1; }
    });
    const processCnt = project.process ? project.process.length + 1 : 1;

    // 更新project的process
    if (project.process) project.process.push(result._id);
    else project.process = [result._id];
    await Projects.updateOne({ _id: projectId }, { process: project.process });
    // 更新project的progress
    await projects.updateProgress(projectId, finishCnt, processCnt);

    return result;
  }

  async list(projectId) {
    const { ctx } = this;
    const { Projects, Process } = ctx.model;
    const project = await Projects.findById(projectId, 'process');
    const processIdArr = project.process;
    const result = await Process.find({ _id: { $in: processIdArr } });
    // console.log('!@#!!$ list', result);
    return result;
  }
  async readById(id) {
    const { ctx } = this;
    const { Process } = ctx.model;
    return await Process.findById(id);
  }

  async updateCostById(id, costValue) {
    const { ctx } = this;
    const { Process } = ctx.model;
    const processCost = await this.readById(id);
    if (processCost.cost) {
      processCost.cost += costValue;
    }
    else {
      processCost.cost = costValue;
    }
    return await Process.updateOne({ _id: id }, { cost: processCost.cost });
  }

  async updateStatus(id) {
    const { ctx } = this;
    const { Process } = ctx.model;
    const { projects } = this.service;
    const obj = ctx.request.body;
    // console.log('?????obj', obj);
    const { status, projectId } = obj;
    if (!status) return;
    // 更新子任务状态
    const result = await Process.updateOne({ _id: id }, { status });
    // 获取项目详情
    const project = await projects.read(projectId);
    // 计算已完成子任务数和未完成子任务数
    let finishCnt = 0;
    project.process.forEach(process => {
      if (process.status === 3) { finishCnt++; console.log(process._id); }
    });
    const processCnt = project.process ? project.process.length : 0;
    // 更新项目进度
    await projects.updateProgress(projectId, finishCnt, processCnt);
    return result;
  }
}

module.exports = ProcessService;