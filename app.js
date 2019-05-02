const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
  // 挂载 strategy
  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {
    // console.log('1', username, password);
    // format user
    const user = {
      provider: 'local',
      username,
      password,
    };
    // console.log('2 %s %s get user: %j', req.method, req.url, user);
    app.passport.doVerify(req, user, done);
  }));

  const localHandler = async (ctx, { username, password }) => {
    // console.log('4 ', username, password);
    const getUser = username => {
      return ctx.service.users.readByName(username);
    };
    const existUser = await getUser(username);
    if (!existUser) return null;  // 用户不存在
    const psw = existUser.password;
    if (psw !== password) return null;  // 密码不匹配
    return existUser;  // 验证通过, 登录成功
  };

  // 处理用户信息
  app.passport.verify(async (ctx, user) => {
    // console.log('3 ', user);
    const existUser = await localHandler(ctx, user);
    if (existUser) {
      // id存入cookie，用于验证过期
      const auth_token = existUser._id;
      const options = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      };
      ctx.cookies.set(app.config.auth_cookie_name, auth_token, options);
      // console.log('existUser', existUser);
      ctx.user = existUser;
      ctx.body = {
        status: 1,
        data: existUser,
        msg: null
      };
    }
    return existUser;
  });
  // app.passport.serializeUser(async (ctx, user) => {

  // });
  app.passport.deserializeUser(async (ctx, user) => {
    // console.log('6666', user);
    if (user) {
      // console.log('4124');
      const auth_token = ctx.cookies.get(ctx.app.config.auth_cookie_name, {
        signed: true,
      });
      // console.log('14324', auth_token);
      if (!auth_token) return user;
      const user_id = auth_token;
      user = await ctx.service.users.readBy_id(user_id);
      // console.log('34', user);
      if (!user) return user;
      ctx.user = user;
    }
    ctx.body = {
      status: 1,
      data: user,
      msg: ''
    };
    return user;
  });
};