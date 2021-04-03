var http = require("http");
const dirTree = require("directory-tree");
var fs = require('fs');
//const content = require("index.html")

http.createServer(function (request, response) {
    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    fs.readFile('clients.html', function (err, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });

        // My code

        const tree = dirTree('./brands/');
        console.log(tree);
        // End my code

        // Send the response body as "Hello World"
        response.end(data);
    });
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');