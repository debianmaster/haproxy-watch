"use strict";
var Monit = require("./lib/monit");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

function haproxyWatch(){

}

haproxyWatch.prototype.checkHealth = function(config,callback){
    var $this=this;
    var monit = new Monit();
    monit.checkHealth(config.watch,config.auth,config.dontWatch,config.port,function(err,result){
        if(err) callback(err);
        if(config.smtp){
            console.log("sending email");
            $this.sendEmail(config.smtp,result,function(err){
                callback(err);
            })
        }else{
            callback(null,result);
        }
    });
}

haproxyWatch.prototype.sendEmail=function(smtp,healthInfo,callback){
    console.log(smtp,healthInfo);
    this.transport = nodemailer.createTransport(smtpTransport({
        host: smtp.host || "localhost",
        port: smtp.port || 25
    }));

    var mailOptions = {
        from: smtp.from, // sender address
        to: smtp.to,
        subject: smtp.subject, // Subject line
        text: JSON.stringify(healthInfo, null, "\t") // plaintext body
        //html: JSON.stringify(errors,null,"\t") // html body
    };
    try {
        this.transport.sendMail(mailOptions, function (error, info) {
            callback(error,info);
        });
    }
    catch (ex) {
        callback(ex);
    }
}

module.exports =  haproxyWatch;