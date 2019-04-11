'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { users, projects, process, teams } = controller;
  router.post('/login', app.passport.authenticate('local',{ successRedirect: false }));


  router.get('/users', users.list);
  router.post('/users', users.create);

  router.get('/projects', projects.list);
  router.post('/projects', projects.create);
  router.get('/projects/:id', projects.read);

  router.post('/process/:id', process.create);

  router.get('/teams', teams.list);
  router.post('/teams', teams.create);
};
