//Imports
var http = require('http'),
path = require("path"),
url = require("url"),
filesys = require("fs");

//Globals
var port = 8080,
DEBUG_MODE = 1; // Debug mode 1 is on, 0 is off

function homePage(request, response) {
  response.write('Hello World!');
}

//404 page if a file is not found by the server
function respondWith404(response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found\n");  
    response.end();
}

http.createServer(function(request,response) {
    var url = request.url;
    var full_path = path.join(process.cwd(),request.url);
    console.log(url);
    filesys.exists(full_path, function(exists) {
        if(exists) {
            if(url == "" ||  url == "/") {
                full_path += "index.html";
            }
            filesys.readFile(full_path, "binary", function(err, file) {
                if (err) {  
                     response.writeHeader(500, {"Content-Type": "text/plain"});  
                     response.write(err + "\n");  
                     response.end();  
                 }  
                 else{
                    response.writeHeader(200);
                    response.write(file, "binary");  
                    response.end();
                } 
            });
        } else { // file does not exists
            respondWith404(response);
        }
    });

}).listen(port);
console.log("Listening on port %s", port);
