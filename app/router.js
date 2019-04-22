'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { users, projects, process, teams, refundAmount, refunds } = controller;
  router.post('/login', app.passport.authenticate('local', {
    successRedirect: false
  })
  );
  router.get('/logout', users.logout);

  router.get('/users', users.list);
  router.post('/users', users.create);

  router.get('/projects', projects.list);
  router.post('/projects', projects.create);
  router.get('/projects/:id', projects.read);

  // 根据projectId创建子任务
  router.post('/process/:id', process.create);
  // 根据processId更新子任务状态
  router.put('/process/status/:id', process.updateStatus);

  router.post('/refundAmount/:id', refundAmount.create);
  router.get('/refundAmount/:id', refundAmount.readByProjectId);

  router.post('/refunds', refunds.create);

  router.get('/teams', teams.list);
  router.post('/teams', teams.create);
};
