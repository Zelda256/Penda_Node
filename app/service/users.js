const Service = require('egg').Service;

class UserService extends Service {
  async create() {
    const { ctx } = this;
    const { Users } = ctx.model;
    const user = new Users(ctx.request.body);
    const result = await user.save();
    // console.log(result);
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
  async readByName(name) {
    const { ctx } = this;
    const { Users } = ctx.model;
    return await Users.findOne({ name });
  }
}

module.exports = UserService;