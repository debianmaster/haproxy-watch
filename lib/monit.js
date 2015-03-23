var request = require('request');
var cheerio = require('cheerio');
var async=require('async');
var _ = require('lodash');


//var dontWatch=[];//"si_widget/ms11"
//var serversToWatch=["sv2lxrmp01","sv2lxrmp02","sv2lxrmp03","sv2lxrmp04"];
var errors=[];



function Monit(){

}
Monit.prototype.checkHealth =function(watch,auth,dontWatch,port,callback) {
    $this=this;
    var authHeader=null;
    if(undefined==dontWatch) dontWatch=[];
    if(undefined==port) port=4997;
    if(undefined==auth) { auth={username:"scloaduser",password:"test"} };

    this.dontWatch=dontWatch;
    this.serversToWatch=watch;
    this.auth=auth;
    this.port=port;
    if(this.auth){
        authHeader={ 'Authorization': 'Basic '+(new Buffer($this.auth.username+":"+$this.auth.password)).toString('base64')};
    }
    async.each($this.serversToWatch, function (item, cb) {
        request({
            url: 'http://' + item + ':'+$this.port,
            headers:authHeader
        }, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                $ = cheerio.load(html);
                $('tr.active0').each(function (index, row) {
                    errors.push(row.children[0].children[0].attribs.name);
                });
                return cb();
            }
            else {
                errors.push(item);
                return cb();
            }
        });
    }, function () {
        errors = _.difference(_.uniq(errors),dontWatch);
        if (errors.length > 0 ) {
            callback(null,errors);
        }
        else{
            callback(null);
        }
    });
}
module.exports = Monit;