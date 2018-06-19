var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var restful = require('node-restful');
var methodOverride = require('method-override');
var app = express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
    users={},
    onlineUsers={};


//login operations by using passport
var passport=require('passport');
var expressSession2=require('express-session')
app.use(expressSession2({secret:'topSecret'}));
app.use(passport.initialize());
app.use(passport.session());



//flash messages
var flash=require('connect-flash');
app.use(flash());
//db operations
var mongoose = require('mongoose');
var dbConfig=require('./db');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url)
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));


var index = require('./routes/index')(passport);
var users = require('./routes/users');
var products = require('./routes/products');
var messages=require('./routes/messages');

server.listen(3003);



var PublicMessage = require('./models/Message.js');
var Group= require('./models/Group.js');
var GroupMessage=require('./models/GroupMessage.js')



var groupSchema=mongoose.Schema({
    groupName:String,
    groupSubscriber:String,
    groupMsg:String,
    created:{type:Date,default:Date.now}
})



io.sockets.on('connection',function (socket) {



    //sonradan giren kullanıcılara gösterilecek mesajların limit sayısı
    var query=PublicMessage.find({});

    //ascending ==== created
    //load old public messages
    query.sort('-updated_at').limit(8).exec(function (err,docs) {

        if(err) throw err;
        //console.log('Sending old msgs!');
        //eski genel  mesajları gönderen yer
        socket.emit('load old msgs',docs);

        //önceden oluşturulan grupları kullanıcılarda oluşturmak için







    });
    socket.on('new user', function (data,callback) {

        //nikin başka kullanıcı tarafından alınıp alınmadığımı kontrol ediyor
        if (data in onlineUsers){
            callback(false);

        }else
        {
            callback(true);
            //sıkıntı yoksa burası çalışıyor
            socket.username=data;
            users[socket.username]=socket;
            onlineUsers[socket.username]=socket;
            updateNickNames();
            loadOldGroups();
            loadOldGroupMessages();

        }



    });

    socket.on('rest chat message',function (data) {
        io.sockets.emit('new message', {message: data.message, username: data.username,updated_at:data.updated_at});

    });
    //(eventname, callback)
    socket.on('send message',function (data,callback) {

        //boşlukları falan yoketmek için
        var msg=data.trim();
        if(msg.substr(0,3) === '/w '){
            // /w kullanici deneme
            //console.log(data);
            // /w kullanici deneme
            //console.log(msg);

            //ilk 3 karakteri buda geriye kalanla işlem yapacağız
            //deneme 123
            msg=msg.substr(3);
            //console.log(msg);

            //msg içinde içinde boşluğun yeri neresi burada 6 olacak
            //6
            var ind=msg.indexOf(' ');
            //console.log(ind);

            if (ind!== -1 ){
                //string içinde boşluğa kadar olan yerdeki karakteri kullanıcı adı olarak al
                //bizim sistem böyle zaten
                var name=msg.substring(0,ind);
                //boşluğun başladığı yerden sonuna kadar olan yer
                var msg =msg.substring(ind+1);
                if((name in users) && (name in onlineUsers)){

                    users[name].emit('whisper',{message:msg,username:socket.username});
                    console.log("whisper");


                }
                else if(name in users) {
                    var newPrivateMsgWillSendOnline=new PublicMessage ({message:msg,username:socket.username});

                    newPrivateMsgWillSendOnline.save(function (err) {
                        if(err) throw err;
                        io.sockets.emit('new message', {message: "Mesaj kaydedildi kullanıcı online olunca gönderilecek!", username: socket.username});


                    });



                }






                else{

                    callback("Error enter a valid user");


                }

            }
            else{

                callback('Error! please enter a message for your whisper!');


            }

        }
        else{


            var newMsg=new PublicMessage ({message:msg,username:socket.username});
            newMsg.save(function (err) {
                if(err) throw err;
                io.sockets.emit('new message', {message: msg, username: socket.username,updated_at:Date.now()});

            });
            //herkese yollar
            //gönderen hariç herkese yollar
            //socket.broadcast.emit('new message',data);
        }

    });
    socket.on('send group message',function (data,callback) {


        var ind=data.indexOf(' ');
        var msg=data.substring(0,ind);
        //boşluğun başladığı yerden sonuna kadar olan yer
        var roomName1 =data.substring(ind+2);
        var groupMessage=new GroupMessage ({roomname:roomName1,roomUsername:socket.username,message:msg});


        groupMessage.save(function (err) {
            if(err) throw err;



            // io.sockets.emit('new message', {msg: msg, nick: socket.nickname});

            io.sockets.emit('new group message', {roomname:roomName1,roomUsername:socket.username,message:msg});


        });







    });
    socket.on('create group',function (data,callback) {


        var RoomName=data;
        //boşluğun başladığı yerden sonuna kadar olan yer
        var GroupCreaterUsername =socket.username;

        Group.findOne({roomname: RoomName},function (err,result) {
            if (err) throw err;
            if(result){

                    socket.emit('group name already taken');


            }

            else{

            var newGroup=new Group({roomname:RoomName,GroupCreaterUsername:GroupCreaterUsername});
            newGroup.save(function (err) {
            if (err) throw err;

            socket.emit('new group created', {roomname: RoomName, GroupCreaterUsername: GroupCreaterUsername});


            })}



        });

    });

    function updateNickNames(){
        io.sockets.emit('usernames',Object.keys(onlineUsers));


    }
    function loadOldGroupMessages(data ){

        if(data in onlineUsers)
        {



        }
        else {


            var chatGroup=GroupMessage.find({});
            chatGroup.sort('-updated_at').exec(function(err,docs2){

                if (err) throw err;
                for(var i=0;i<docs2.length;i++){

                    io.sockets.emit('new group message', {groupName:docs2[i].groupName,groupSubscriber:docs2[i].groupSubscriber,groupMsg:docs2[i].groupMsg});



                }

            });




        }


    }
    function loadOldGroups() {
        Group.find({GroupCreaterUsername: socket.username},function (err,groups) {
            if (err) throw err;
            if(groups.length!=0){

                console.log("groups");
                socket.emit("load old groups",groups);
            }

            else  if (groups.length==0){
                console.log("groups none");

            }


        });



    }


    function loadOldGroupMessages(){
        //burada mesajları zamana göre sıralayabilirsin




        var query=GroupMessage.find();
        query.sort('-updated_at').limit(5).exec(function (err,GroupMessages) {
            if(err) throw err;
            if (GroupMessage.length!=0){
                socket.emit("load old group messages",GroupMessages);
                }
            else if(GroupMessages.length==0)
            {
                console.log("Old Group Messages none");

            }
        });



    }


    socket.on('disconnect',function (data) {

        //socket io ile bağlantı açtı ama bağlanması zor geldi sayfayı kapattı o zaman bir şey yapmaya gerek yok
        if(!socket.username) return;
        delete onlineUsers[socket.username];

        //eski halde nicknames'i dizi şeklinde tutuyorduk şimdi ayırdık
        //nicknames.splice(nicknames.indexOf(socket.username),1);
        updateNickNames();
    })









    //eski grub mesajları

});


















// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var initPassport=require('./passport/init');
initPassport(passport);

app.use('/', index);
app.use('/users', users);
app.use('/products', products);
app.use('/messages',messages);

var Category = app.resource = restful.model('category', mongoose.Schema({
  cat_name: String,
}))
.methods(['get', 'post', 'put', 'delete']);

Category.register(app, '/category');





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// 3000 PORTUNU DİNLE


module.exports = app;
