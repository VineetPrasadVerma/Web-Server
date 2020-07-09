const fs = require('fs').promises

fs.writeFile('./test.txt', 'vinet', (err) => { console.log(err, 'writen') })
