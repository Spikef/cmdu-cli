var fs = require('fs');
var path = require('path');

function deldirSync (dir) {
    var files = [];
    if( fs.existsSync(dir) ) {
        files = fs.readdirSync(dir);
        files.forEach(function(file){
            var cur = path.resolve(dir, file);
            if(fs.lstatSync(cur).isDirectory()) {
                // recurse
                deldirSync(cur);
            } else { 
                // delete file
                fs.unlinkSync(cur);
            }
        });
        
        fs.rmdirSync(dir);
    }
}

fs.deldirSync = deldirSync;

module.exports = fs;