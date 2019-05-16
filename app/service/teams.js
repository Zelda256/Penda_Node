const Service = require('egg').Service;

class TeamsService extends Service {
  async create() {
    const { ctx } = this;
    const { Teams } = ctx.model;
    const { users } = ctx.service;
    const item = ctx.request.body;

    // 创建新团队
    const team = new Teams(item);
    const result = await team.save();

    // 将团队id加入到每个团队者中的team数组
    const teamId = result._id;
    return await users.updateTeam(team.member, teamId);
  }

  async list() {
    const { ctx } = this;
    const { Teams, Projects } = ctx.model;
    const teams = await Teams.find({_id: { $in : ctx.user.teams}}).populate('member');
    const projs = await Projects.find({team: {$in: ctx.user.teams}}, 'name team status');
    const result = [];
    teams.forEach(team => {
      let tmpResult = {
        _id : team._id,
        name: team.name,
        member: team.member,
        proj: []
      };
      result.push(tmpResult);
    });
    projs.forEach(project => {
      let team = result.find(res => String(res._id) === String(project.team));
      if (team) {
        team.proj.push(project);
      }
      
    });

    return result;
  }

  async readById(_id) {
    const { ctx } = this;
    const { Teams } = ctx.model;

    return await Teams.findById(_id).populate('member');
  }

  async listByIdArr(teamIdArr) {
    const { ctx } = this;
    const { Teams } = ctx.model;

    return await Teams.find({_id: { $in : teamIdArr}}).populate('member');
  }
}

module.exports = TeamsService;