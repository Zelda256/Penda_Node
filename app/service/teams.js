const Service = require('egg').Service;

class TeamsService extends Service {
  async create() {
    const { ctx } = this;
    const { Teams } = ctx.model;
    const item = ctx.request.body;

    // 创建新团队
    const team = new Teams(item);
    const result = await team.save();
    
    // 将团队id加入到每个团队者中的team数组
    const teamId = result._id;
    
    return result;
  }

  async list() {

  }
  async read() {


  }
}

module.exports = TeamsService;