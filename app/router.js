'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { users, projects, process } = controller;
  router.get('/users', users.list);
  router.post('/users', users.create);

  router.get('/projects', projects.list);
  router.post('/projects', projects.create);
  router.get('/projects/:id', projects.read);

  router.post('/process/:id', process.create);
};
