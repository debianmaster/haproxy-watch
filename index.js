var request = require('request');
var cheerio = require('cheerio');
var async=require('async');
var _ = require('lodash');


var dontWatch=[];//"si_widget/ms11"
var serversToWatch=["sv2lxrmp01","sv2lxrmp02","sv2lxrmp03","sv2lxrmp04"];
var errors=[];
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var username = "scloaduser" , password = "test";
transport = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_HOST || "localhost",
    port: process.env.MAIL_PORT || 25
}));

async.each(serversToWatch, function (item,cb) {
    request({
        url:'http://'+item+':4997',
        headers: { 'Authorization': 'Basic '+(new Buffer(username+":"+password)).toString('base64')}
    }, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(html);
            $('tr.active0').each(function(index,row){
                errors.push(row.children[0].children[0].attribs.name);
            });
            cb();
        }
        else{
            errors.push(item);
            cb();
        }
    });
},function(){
    if(errors.length){
        console.log(_.difference(_.uniq(errors),dontWatch));
        var mailOptions = {
            from: process.env.EMAIL_SENDER || "9chakri@gmail.com", // sender address
            to: process.env.EMAIL_TO || "9chakri@gmail.com",
            subject: "Server health :  Following services are down !", // Subject line
            text: JSON.stringify(errors,null,"\t") // plaintext body
            //html: JSON.stringify(errors,null,"\t") // html body
        };
        try{
	        transport.sendMail(mailOptions, function(error, info){
        	    console.log(error,info);
	        });
        }
        catch(ex){
	    console.log(ex);	
        }
    }
});

