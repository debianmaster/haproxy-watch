## Monitor Haproxy and websites under HAProxy and send alerts


Usage

`$ npm install haproxy-watch`


```javascript

var proxyWatch = require("haproxy-watch");
var haproxyWatch = new proxyWatch();

haproxyWatch.checkHealth({
    watch:["lxrmp03","lxrmp04"],
    auth:{username:"scloaduser",password:"test"}    
},function(err,result){
    console.log(err,result);
});

```


```javascript

var proxyWatch = require("haproxy-watch");
var haproxyWatch = new proxyWatch();

haproxyWatch.checkHealth({
    watch:["lxrmp03","lxrmp04"],
    dontWatch:["ramp_push/lxrmp10"],
    auth:{username:"admin",password:"pass"},
    smtp:{
        host:"mailhost.yourhost.com",
        port:25,from:"me@mycompany.com",
        to:"support@mycompany.com",
        subject:"Following services are down"
    }
},function(err,result){
    console.log(err,result);
});


```
