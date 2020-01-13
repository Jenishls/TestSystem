const Express = require('express')
const app = new Express()
const cors = require('cors');
var bodyParser = require('body-parser');
const PromiseFtp = require('promise-ftp');
const fs = require('fs');
var ftp = new PromiseFtp();
//select ApprovedBy, count (Amount)  from TransDaily where left(ApprovedBy,1) = '_'  Group By ApprovedBy
app.use(cors())
app.use(bodyParser.json())

// const config = require('./knexfile')
// const knex = require('knex')(config)

// const connect = () => {
//     let news
//     let fileList = []
//     return news = ftp.connect({ host: '192.168.103.3' })
//         .then(function(serverMessage) {
//             console.log('Server message: ' + serverMessage);
//             return ftp.list('/Main-REPORT/Today1');
//         }).then(function(list) {
//             for (var i = 0; i < list.length; i++) {
//                 //fileList.push(list[i].name)
//                 console.log(list[i].name)
//             }
//             ftp.end()
//             //return fileList; // return fileList;
//         })
// }


// app.get('/api/it/report/all', (req, res) => {
//     ftp.connect({ host: '192.168.103.3' })
//         .then(function(serverMessage) {
//             return ftp.list('/Main-REPORT/Today1/');
//         }).then(function(list) {
//             ftp.end()
//             res.json(list) // return fileList;
//         }).catch(error => {
//             res.json(error)
//         })
// })

// app.post('/api/it/report/', (req, res) => {
//     knex('mail_list')
//         // .where('name','like',req.body.name)pi
//         .then(data => {

//             res.json(data)
//         })today
// })

app.get('/api/it/report/today', (req, res) => {
    ftp.connect({ host: '192.168.103.3' })
        .then(function(serverMessage) {
            return ftp.list('/Main-REPORT/Today1/');
        }).then(function(list) {
            ftp.end()
            res.json(list) // return fileList;
        }).catch(error => {
            res.json(error)
        })
})

app.get('/api/it/report/previous', (req, res) => {
    ftp.connect({ host: '192.168.103.3' })
        .then(function(serverMessage) {
            return ftp.list('/Main-REPORT/previous2/');
        }).then(function(list) {
            ftp.end()
            res.json(list) // return fileList;
        }).catch(error => {
            res.json(error)
        })
})

//cannot pass req value after ftp.connect
app.get('/api/it/report/previous/month/:month', (req, res) => {
    var month = req.params.month;
    ftp.connect({ host: '192.168.103.3' })
        .then(function(serverMessage) {
            console.log(month);
            return ftp.list('/Main-REPORT/previous2/' + month);
        }).then(function(list) {
            ftp.end()
            res.json(list) // return fileList;
        }).catch(error => {
            res.json(error)
        })
})



app.listen(7000, () => {
    console.log('Server running on 7000')
})