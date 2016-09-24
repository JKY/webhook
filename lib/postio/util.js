/* 解析form*/
var parse_form = exports.parse_form = function(req,resp,func){
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.on('progress', function(bytesReceived, bytesExpected) {
        
    });
    form.on('end', function(){
       
    });
    form.onPart = function(part){
        if(!part.filename){
            form.handlePart(part);
            return;
        }
        part.on("data",function(buffer){
            if(!form._files) form._files = {};
            if(!form._files[part.filename]) {
                form._files[part.filename] = buffer;
            }else{
                form._files[part.filename] = Buffer.concat([form._files[part.filename],buffer]);
            }
        });
        part.on("end",function(){
            form.emit('file', part.name, { partname:part.name, name: uid(req) + "_" + Date.now()+"."+part.filename.split(".").pop(), 
                                           data: form._files[part.filename]});
        });
    };
    form.parse(req,function(err,fileds,files){
        if(err !== null){
           sys.log(("pare form error:" + err).red);
           return;
        }else{
            func(fileds,files);
        }
    });
};

exports.out = {
  err:function(resp,code,data){
        resp.writeHead(code, {'Content-Type': 'application/json'});
          if(data){
            resp.end(JSON.stringify(data));           
          }else{
              resp.end(); 
          }
  },
  json:function(resp,code,data){
      resp.writeHead(code, {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin':'*',
                                'Access-Control-Allow-Methods':'get,post,put,delete,option'});
      var str = JSON.stringify(data);
        //sys.log("return:" + str);
      resp.end(str);  
      return true;          
  },
  redirect: function(resp,url){
      resp.writeHead(302, {'Location': url});
      resp.end();      
  },
  
  text:function(resp,data){
    resp.writeHead(200, {'Content-Type': 'text/plain',
                         'Access-Control-Allow-Origin':'*',
                         'Access-Control-Allow-Credentials':true});
    resp.end(data);  
    return true;                
  },

  error: function(resp, data) {
      resp.writeHead(200, {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin':'*',
                                'Access-Control-Allow-Methods':'get,post,put,delete,option'});
      var str = JSON.stringify({ err: data, result: null });
      resp.end(str);
  },

  success: function(resp, data) {
      resp.writeHead(200, {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin':'*',
                                'Access-Control-Allow-Methods':'get,post,put,delete,option'});
      var str = JSON.stringify({ err: null, result: data });
      resp.end(str);
  }
};


// 验证
exports.validate = {
  is: function(format,str){
    var TAB = {
      'email': /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      'mobile': /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
      'number':/^\d+(\.?)(\d+)?$/
    }
    if(format == 'string'){
        return str != null && str != undefined && str.length > 0;
    }else{
      var re = TAB[format];
      if(re != undefined){
        return re.test(str);
      }else{
        throw new Error("not support format:" + format);
      }
    }
  }
}