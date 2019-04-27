const Service = require('egg').Service;

class UserService extends Service {
  async create() {
    const { ctx } = this;
    const { Users } = ctx.model;
    const user = new Users(ctx.request.body);
    const result = await user.save();
    return result;
  }
  async list() {
    const { ctx } = this;
    const { Users } = ctx.model;
    const result = await Users.find();
    return result;
  }

  async readBy_id(id) {
    const { ctx } = this;
    const { Users } = ctx.model;
    return await Users.findById(id);
  }
  async updateBasicInfo(userId) {
    const { ctx } = this;
    const { Users } = ctx.model;
    const { name, email, phone, department, job } = ctx.request.body;
    console.log('$@#$!!!!!!!!!!!!!!!!', ctx.request.body);
    console.log('??????????', name, email, phone, department, job);
    if (!name || !email || !phone) return 0;
    return await Users.updateOne({ _id: userId }, {
      name,
      email,
      phone,
      department,
      job
    });

  }
  async readByName(name) {
    const { ctx } = this;
    const { Users } = ctx.model;
    return await Users.findOne({ name });
  }
  async updateTeam(userIdArr, teamId) {
    const { ctx } = this;
    const { Users } = ctx.model;

    return await Users.updateMany(
      { _id: { $in: userIdArr } },
      { $addToSet: { teams: teamId } }
    );
  }
}

module.exports = UserService;