var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var allUser = []
io.on('connection', function(socket){

  socket.on('removeuser', function(user){
    let index = allUser.indexOf(user)
    if(index==-1){
      return
    }
    allUser.splice(index, 1);
    io.emit('update name',allUser)
  });

  socket.on('chat message', function(msg,user,id){
    let body = {}
    body.user = user
    body.msg = msg
    body.id = id
    io.emit('chat message',body);
  });

  socket.on('update username', function(){
      io.emit('update name',allUser)
  });

  socket.on('join', function(name,id){
    let body = {}
    let result  = allUser.find(el=>{
      return el == name
    })
  
    if(result=== undefined){
      allUser.push(name)
      console.log(allUser)
      body.id = id
      body.status = true
      body.name = name
      io.emit('checkuser',body)
    }else{
      body.id = id
      body.status = false
      io.emit('checkuser',body)
    }
    
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
