const Service = require('egg').Service;
const fetch = require('node-fetch');

class ProjectService extends Service {
  async create() {
    const { ctx } = this;
    const { Projects } = ctx.model;
    const item = ctx.request.body;
    await fetch('https://www.random.org/strings/?num=1&len=5&digits=on&upperalpha=on&loweralpha=on&format=plain')
      .then(res => res.text())
      .then(text => item.id = text.substr(0, 5));  // 删除换行符
    if (item.id) {
      const project = new Projects(item);
      const result = await project.save();
      return result;
    }
    return false;
  }

  async list() {
    const { ctx } = this;
    const { Projects } = ctx.model;
    const { teams } = ctx.service;
    // 所有项目
    const projects = await Projects.find().populate('creator');
    const teamIdArr = [];
    // 数组中所有项目的团队id
    projects.forEach(project => {
      if (!teamIdArr.includes(project.team)) teamIdArr.push(project.team);
    });

    const teamsArr = await teams.listByIdArr(teamIdArr);
    // 将项目中的团队id替换成团队成员
    projects.forEach(project => {
      project.team = teamsArr.find((item => item._id.toString() === project.team.toString()));
    });

    return projects;
  }
  async read() {
    const { ctx } = this;
    const { Projects, Process } = ctx.model;
    const { teams } = ctx.service;
    const id = ctx.params.id;
    console.log(id);
    // 所有项目
    const project = await Projects.findById(id).populate('creator');

    // 更新团队id为团队成员
    const team = await teams.readById(project.team);
    project.team = team;

    // 将项目中的processID换成process对象
    if (project.process && project.process.length) {
      const process = await Process.where('_id').in(project.process).populate('member');
      project.process = process;
    }

    return project;
  }
  async findOne(_id) {
    const { ctx } = this;
    const { Projects } = ctx.model;

    return await Projects.findById(_id);
  }
  async updateProcess(_id, obj) {
    const { ctx } = this;
    const { Projects } = ctx.model;

    return await Projects.updateOne({ _id }, { process: obj });
  }
}

module.exports = ProjectService;