const jsonServer = require('json-server');
const postLogin = require('./mock-server/actions/postLogin');
const postLogout = require('./mock-server/actions/postLogout');
const { getData, fetchMessages, updateMessages } = require('./mock-server/actions/getData');
const getIssues = require('./mock-server/actions/getIssues');
const getIssue = require('./mock-server/actions/getIssue');

const server = jsonServer.create();
const router = jsonServer.router('db.json');

const middlewares = jsonServer.defaults({ bodyParser: true });

server.use(middlewares);

server.post('/api/auth/login', postLogin);
server.post('/api/auth/logout', postLogout);
server.get('/api/auth/check', (_req, res) => {
  res.sendStatus(201);
});

server.get('/api/data', getData);
server.get('/api/issue', getIssues);
server.get('/api/issue/:id', getIssue);

// Handle custom routes for fetching and updating messages
server.get('/api/messages', (req, res) => {
  const messages = fetchMessages();
  res.json(messages);
});

server.put('/api/messages', (req, res) => {
  const updatedMessages = req.body;
  updateMessages(updatedMessages);
  res.sendStatus(200);
});

server.use('/api', router);

server.listen(3001, () => {
  console.log('JSON Server is running');
});
