'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { users, projects, process, teams, refundAmount, refunds, contacts } = controller;
  router.post('/login', app.passport.authenticate('local', {
    successRedirect: false
  })
  );
  router.get('/logout', users.logout);

  router.get('/users', users.list);
  router.post('/users', users.create);
  router.put('/users/:id', users.updateBasicInfo);

  router.post('/contacts', contacts.create);
  router.post('/contacts/:id', contacts.addToContactById);
  router.get('/contacts', contacts.listByUserId);
  router.put('/contacts/:id', contacts.deleteContactById);

  router.get('/projects', projects.list);
  router.get('/projects/name', projects.listName);
  router.post('/projects', projects.create);
  router.get('/projects/:id', projects.read);

  // 根据projectId创建子任务
  router.post('/process/:id', process.create);
  // 根据processId更新子任务状态
  router.put('/process/status/:id', process.updateStatus);

  router.post('/refundAmount/:id', refundAmount.create);
  router.get('/refundAmount/:id', refundAmount.readByProjectId);

  router.post('/refunds', refunds.create);  
  router.get('/refunds', refunds.list);
  router.get('/refunds/summary', refunds.listSummary);

  router.get('/teams', teams.list);
  router.post('/teams', teams.create);
};
