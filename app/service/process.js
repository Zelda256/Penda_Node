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
    const project = await projects.findOne(_id);
    // 更新project的process
    project.process.push(result._id);
    return await projects.updateProcess(_id, project.process);
  }

  async list() {

  }
  async read() {


  }
}

module.exports = ProcessService;