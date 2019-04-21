const Service = require('egg').Service;

class ProcessService extends Service {
  async create() {
    const { ctx } = this;
    const { Process } = ctx.model;
    const { projects } = this.service;
    const item = ctx.request.body;
    const _id = ctx.params.id;

    // 创建process对象
    const process = new Process(item);
    const result = await process.save();
    // 找到对应project
    const project = await projects.read(_id);
    // console.log('project$!$@#@#', project);
    // 更新project的process
    if (project.process) project.process.push(result._id);
    else project.process = [result._id];
    // 更新project的progress
    let finishCnt = 0;
    project.process.forEach(process => {
      if (process.status === 3) { finishCnt++; console.log(process._id); }
    });
    // finishCnt++;
    const processCnt = project.process ? project.process.length : 0;
    project.progress = (finishCnt / processCnt).toFixed(2) * 100;
    console.log(finishCnt, processCnt, project.progress);
    // console.log('project$!$@#@#23333333333', project);
    // return null;
    // 更新子任务涉及到更新项目的过程
    return await projects.updateById(_id, project);
  }

  async list() {

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
    processCost.cost += costValue;
    return await Process.updateOne({ _id: id }, { cost: processCost.cost });
  }
}

module.exports = ProcessService;