/**
 * Module dependencies.
 */
var express = require('express'),
	out = require('./lib/postio/util').out,
	crypto = require('./lib/postio/crypto'),
	fs = require('fs'),
	color = require('colors');


/* authorizer config */
var app = module.exports = express();
app.enable('trust proxy');

app.get('/ping',function(req,resp){
	out.err(resp,200,{
		'err':null,
		'result':'pong'
	});
});

app.post('/data/:appid/:name/:hash',function(req,resp){
	var body = '';
    req.on('data', function(data) {
        body += data;
        if (body.length > 1e6)
            req.connection.destroy();
    });
    req.on('end', function() {
        var appid = req.params.appid;
        var name = req.params.name;
		var hash = req.params.hash;
		console.log('================');
		console.log('appid=' + appid + '');
		console.log('name=' + name + '');
		console.log('hash=' + hash + '');
		console.log('----------------');
		console.log(body);
		var log = '================\n' +
			 	  'appid=' + appid + '\n' + 
			 	  'name=' + name + '\n' + 
			 	  'hash=' + hash + '\n' + 
			 	   body;
		fs.appendFile(__dirname + '/log',log,function(err){

		});
    	out.err(resp,200,{
    		'err':null,
    		'result':null
    	});
    });
});

if (!module.parent) {
  app.listen(7000);
  console.log(('webhook foo'+ ' runnng').green);
}

