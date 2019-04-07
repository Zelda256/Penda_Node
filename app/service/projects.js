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
    const { Projects, Users } = ctx.model;
    // 所有项目
    const projects = await Projects.find();
    const partners = [];
    // 项目中的负责人 & 参与者
    projects.forEach(project => {
      if (!partners.includes(project.creator)) partners.push(String(project.creator));
      project.team.forEach(man => {
        if (!partners.includes(man)) partners.push(String(man));
      });
    });
    // 将项目中的参与者id替换成参与者对象
    const users = await Users.where('_id').in(partners);
    projects.forEach(project => {
      const creator = users.find((item => item._id.toString() === project.creator.toString()));
      if (creator) project.creator = creator;
      project.team = project.team.map(man => {
        let temp = users.find((item => item._id.toString() === man.toString()));
        if (temp) return temp;
      });
    });
    return projects;
  }
  async read() {
    const { ctx } = this;
    const { Projects, Users } = ctx.model;
    const id = ctx.params.id;
    // 所有项目
    const project = await Projects.findOne({ id });
    const partners = [];
    // 项目中的负责人 & 参与者
    partners.push(String(project.creator));
    project.team.forEach(man => {
      if (!partners.includes(man)) partners.push(String(man));
    });

    // 将项目中的参与者id替换成参与者对象
    const users = await Users.where('_id').in(partners);
    const creator = users.find((item => item._id.toString() === project.creator.toString()));
    if (creator) project.creator = creator;
    project.team = project.team.map(man => {
      let temp = users.find((item => item._id.toString() === man.toString()));
      if (temp) return temp;
    });
    return project;
  }
}

module.exports = ProjectService;