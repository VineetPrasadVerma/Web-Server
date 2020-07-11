const { app } = require('./server')
const { bodyParser } = require('./bodyParser')
const { serveStaticFile } = require('./staticHandler')

app.use(bodyParser)
app.use(serveStaticFile)

app.listen(3000, () => {})

app.get('/tasks', (req, res) => {
  console.log('From App', req.params, req.queryParams)
  res.status(200).send('All the tasks')
})

app.get('/tasks/:id/subtasks', (req, res) => {
  console.log('From App', req.params, req.queryParams)
  res.status(200).send('All subtasks of a task')
})

app.get('/tasks/:id/subtasks/:id2', (req, res) => {
  console.log('From App', req.params, req.queryParams)
  res.status(200).send('A subtask of a task')
})

app.post('/upload', (req, res) => {
  console.log('File Uploaded')
  res.status(200).send('File Uploaded')
})
