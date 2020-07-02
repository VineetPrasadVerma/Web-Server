const { app } = require('./server')

app.listen(8000)

app.get('/tasks', (req, res) => {
  console.log(req.params, req.queryParams)
  res.status(200).send('All the tasks')
})

app.get('/tasks/:id/subtasks', (req, res) => {
  console.log(req.params, req.queryParams)
  res.status(200).send('All subtasks of a task')
})

app.get('/tasks/:id/subtasks/:id2', (req, res) => {
  console.log(req.params, req.queryParams)
  res.status(200).send('A subtask of a task')
})
