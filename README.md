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
    auth:{username:"ramp",password:"g6r6na"},
    smtp:{
        host:"mailhost.corp.equinix.com",
        port:25,from:"ramp@equinix.com",
        to:"cjonagam@equinix.com",
        subject:"Following services are down"
    }
},function(err,result){
    console.log(err,result);
});


```
