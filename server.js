var http= require('http');
var fs = require('fs');


function onRequest(req,res){
    

}
http.createServer(onRequest).listen(8888);
console.log("Server's running");