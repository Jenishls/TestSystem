"use strict";

const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs')
const moment = require('moment')
const schedule = require('node-schedule');
const PromiseFtp = require('promise-ftp');
const ftp = new PromiseFtp();

const SMTPConnection = require("nodemailer/lib/smtp-connection")

// date
const subDate = (dateFormat = 'D.M.YYYY') => moment().subtract(1, 'days').format(dateFormat)


var filePath1 = "./download/MIS- CON GL-DAR " + subDate() + ".xlsx"
var filePath3 = "./download/MIS- GL ALL " + subDate() + ".txt"


const connection = function(){
  var fileList = []
  ftp.connect({ host: '192.168.103.3' }) //connecting to ftp
      .then(function(serverMessage) {
          return ftp.list('/Main-REPORT/Today1/') //listing all the files available in the path
      }).then(function(list) {
          console.log(list.length);
          var fileList = check(list) //retriving file names
          for (var i = 0; i < fileList.length; i++) {
            // download(fileList[i])
          }
      }).catch(function(error) {
          console.log(error)
      })
}

//checking if the files are present
const check = function(list) {
    var fileList = []
    for (var i = 0; i < list.length; i++) {
        switch (list[i].name) {
            case "MIS- CON GL-DAR " + subDate() + ".xlsx":
                fileList.push("MIS- CON GL-DAR " + subDate() + ".xlsx")
                break
            case "MIS- GL ALL " + subDate() + ".txt":
                fileList.push("MIS- GL ALL " + subDate() + ".txt")
                break
            //case dateformat without '.'    
            case "MIS- CON GL-DAR " + subDate('DMYYYY') + ".xlsx":
                fileList.push("MIS- CON GL-DAR " + subDate('DMYYYY') + ".xlsx")
                break
            case "MIS- GL ALL " + subDate('DMYYYY') + ".txt":
                fileList.push("MIS- GL ALL " + subDate('DMYYYY') + ".txt")
                break
            //case dateformat with '0'    
            case "MIS- CON GL-DAR " + subDate('0D0MYYYY') + ".xlsx":
                fileList.push("MIS- CON GL-DAR " + subDate('0D0MYYYY') + ".xlsx")
                break
            case "MIS- GL ALL " + subDate('0D0MYYYY') + ".txt":
                fileList.push("MIS- GL ALL " + subDate('0D0MYYYY') + ".txt")
                break
            //case dateformat with '0' & '.'    
            case "MIS- CON GL-DAR " + subDate('0D.0M.YYYY') + ".xlsx":
                fileList.push("MIS- CON GL-DAR " + subDate('0D.0M.YYYY') + ".xlsx")
                break
            case "MIS- GL ALL " + subDate('0D.0M.YYYY') + ".txt":
                fileList.push("MIS- GL ALL " + subDate('0D.0M.YYYY') + ".txt")
                break
            default:
                // console.log(list[i])
        }
    }
    console.log(fileList)
    // return fileList
}

//download
const download = function(file) {
  // console.log(file)
    const link = new PromiseFtp();
    link.connect({ host: '192.168.103.3' })
        .then(function(serverMessage) {
            return link.get('/Main-REPORT/Today1/' + file)
        })
        .then(function(stream) {
            return new Promise(function(resolve, reject) {
                stream.once('close', resolve);
                stream.once('error', reject);
                stream.pipe(fs.createWriteStream('download/' + file));
            })
        })
}

//mail
async function main() {
    let transporter = nodemailer.createTransport({
        host: "192.168.100.2",
        port: 25,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'system@nccbank.com.np', // generated ethereal user
            pass: 'Climate@123' // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"No Reply"<system@nccbank.com.np>', // sender address
        to: `jenish.shrestha@nccbank.com.np`,

        subject: "Reports", // Subject line
        text: "Please check the the attachments", // plain text body
        html: `<p>Dear Sir/Madam, </p><p><b>This is the system generated reports.</b></p>
        <p>With Regards,<br /> IT Department</p>  
        `, // html body
        attachments: [
            { path: filePath1 },
            // { path: filePath2 },
            { path: filePath3 },
        ]
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// var j = schedule.scheduleJob('* * * * *', function() {
        // connection()
//     // main().catch(console.error);
//     console.log('Mail Send Success');
// });

module.exports = {
  "connection" : connection
}