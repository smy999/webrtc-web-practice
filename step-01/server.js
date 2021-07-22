var http = require('http');
var node_static = require('node-static');

var static_directory = new node_static.Server(__dirname);

var server = http.createServer();
server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});

console.log(' [*] Listening on 0.0.0.0:8887' );
server.listen(8887, '0.0.0.0');