const jsonServer = require('json-server');
const postLogin = require('./mock-server/actions/postLogin');
const postLogout = require('./mock-server/actions/postLogout');
const { getData } = require('./mock-server/actions/getData');
const getIssues = require('./mock-server/actions/getIssues');
const getIssue = require('./mock-server/actions/getIssue');
const deleteIssue = require('./mock-server/actions/deleteIssue');

const server = jsonServer.create();
const router = jsonServer.router('db.json');

const middlewares = jsonServer.defaults({ bodyParser: true });

const express = require('express');
const app = express();

// Middleware to set Cache-Control header
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});


server.use(middlewares);

server.post('/api/auth/login', postLogin);
server.post('/api/auth/logout', postLogout);
server.get('/api/auth/check', (_req, res) => {
  res.sendStatus(201);
});

server.get('/api/data', getData);
server.get('/api/issue', getIssues);
server.get('/api/issue/:id', getIssue);
server.delete('/api/issue/:messageId', deleteIssue);

server.use('/api', router);

server.listen(3001, () => {
  console.log('JSON Server is running');
});
