const path = require('path')
module.exports = {
  client:'mssql',

  connection : {
    host : '127.0.0.1',
    user : 'sa',
    password : 'software',
    database : 'IT'
  },
  migrations:{
    tableName : 'migrations',
    diretory : path.resolve(__dirname,'./migrations'),
  },
  useNullasDefault : true
}