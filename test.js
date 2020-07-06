const fs = require('fs').promises

console.log(fs.readFile('./TodoApp-JS+Postgresql/public/index.html').then(res => console.log(res.toString())))
