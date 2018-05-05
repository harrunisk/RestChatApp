
jQuery(function($) {
    var socket = io.connect();
    var $nickForm= $('#loginNew');
    var $nickError=$('#nickError');
    var $nickBox=$('#user');
    var $users=$('#users');
    var $messageForm=$('#send-message');
    var $messageBox=$('#message');
    var $chat=$('#chat');
    var $login=$('#login');
    var $messageBox=$('#messageBox');
    var $onlineUsers=$('#onlineUsers');
    var $chatNew=$('#chatNew');
    var $sendMessageButton=$('#sendMessageButton');
    var $messageArea=$('#messageArea');
    var $groupPlace=$('#groupPlace');
    var $addGroupUserButton=$('#addGroupUserButton');
    var $groupNameForUser=$('#groupNameForUser');
    var $userNameForGroup=$('#user1');
    var $jadeUserName=$('#username');




    var $createGroup=$('#createGroup');
    var $groupName=$('#groupName');
    var username;


    var i=0;


    $createGroup.click(function (e) {
        e.preventDefault();

        alert("Grupqweqweqew");

        socket.emit('create group',$groupName.val(),function(data){
            //üstteki satıra functionu callbak için ekledik
            //add stuff later

        });
        $groupName.val('');
        alert("Grup başarı ile kuruldu");



    });
    $addGroupUserButton.click(function (e) {
        e.preventDefault();
        var groupName=$groupNameForUser.val();
        var userForGroup=$userNameForGroup.val();
        var groupMsg="addUSer";

        var message=groupName+" "+userForGroup+"  "+groupMsg;
        //actually not group it is for new user but I am using create group
        socket.emit('create group',message,function (data) {

        });
        $groupNameForUser.val('');
        $userNameForGroup.val('');





    })





    //mesaj bize gelince yapılacaklar
    socket.on('new group message',function (data) {
        var html='';


        var ind=data.groupMsg.indexOf(' ');

        if(username==data.groupMsg.substr(0,ind)){

            html+='<div id='+i+'>\n'
            html+='<br>'
            html+='<label id="'+i+'groupName" class="text-center center-block" style="text-align: center" for="usr"><strong> '+data.groupName+'</strong></label>\n'
            html+=' <div id=\''+data.groupName+'\'  class="msg-wrap"> </div>\n'
            html+='<div class="send-wrap ">\n'
            html+='<textarea id="'+i+'groupSendTextArea"class="form-control send-message groupArea" rows="3" placeholder="Write a reply..."></textarea>\n'
            html+='</div>'
            html+='<div class="btn-panel">\n'
            html+='<button  id="'+i+'groupSendMessageButton" type="button" class="btn btn-primary  center-block sendGroupMessage">Mesaj yolla</button>\n'
            html+='</div>'
            html+='<div class="row"></div>'
            html+='</div>'
            i++




            $groupPlace.append(html);
            html=''




        }






        if(data.groupMsg=="" && data.groupSubscriber==username){
            html+='<div id='+i+'>\n'
            html+='<br>'
            html+='<label id="'+i+'groupName" class="text-center center-block" style="text-align: center" for="usr"><strong> '+data.groupName+'</strong></label>\n'
            html+=' <div id=\''+data.groupName+'\'  class="msg-wrap"> </div>\n'
            html+='<div class="send-wrap ">\n'
            html+='<textarea id="'+i+'groupSendTextArea"class="form-control send-message groupArea" rows="3" placeholder="Write a reply..."></textarea>\n'
            html+='</div>'
            html+='<div class="btn-panel">\n'
            html+='<button  id="'+i+'groupSendMessageButton" type="button" class="btn btn-primary  center-block sendGroupMessage">Mesaj yolla</button>\n'
            html+='</div>'
            html+='<div class="row"></div>'
            html+='</div>'
            i++




            $groupPlace.append(html);


        }
        else{

            //burası mesaj gösterme kısmı oldu

            var message='';
            message+='<div class="media msg">'
            message+='<a class="pull-left" href="#">'
            message+='</a>'
            message+='<div class="media-body">'
            message+='<h5 class="media-heading">'+data.groupSubscriber+'</h5>\n'
            //message+=' <small class="pull-right time"><i class="fa fa-clock-o"></i>'+data.updated_at+' </small>\n'
            message+=' <small class="col-lg-10">'+data.groupMsg+'</small>\n'
            message+='</div><br>'
            var $groupMessageArea=$('#'+data.groupName);
            $groupMessageArea.append(message);




        }

    });






        username=$jadeUserName.text();
        socket.emit('new user',$jadeUserName.text(),function (data) {
            var deneme=0;

            if (data){
                $('#messageBox').show();

                $('#nickWrap').hide();
                // $('#contentWrap').show();

            }
            else
            {
                $nickError.html("That username is already taken ! Try again.");


            }


        });





    socket.on('usernames',function (data) {
        var html= '';
        for(var i=0;i<data.length;i++)
        {

            if(data[i]==username) {

                html += '<div  class="media conversation">'
                html += '<a class="pull-left" href="#" rel="' + data[i] + '">'
                html += '<img class="media_object" src="https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png" alt="64x64" style="width: 50px; height: 50px;" >\n'
                html += '<a/>'
                html += '<div class="media-body">'
                html += '<h5 class="media-heading"><a href="#" rel="' + data[i] + '">  ' + data[i] + '</a></h5>'
                html += '</div>'
                html += ' </div>'
            }
            else{

                html += '<div  class="media conversation">'
                html += '<a class="pull-left" href="#" rel="' + data[i] + '">'
                html += '<img class="media_object" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="64x64" style="width: 50px; height: 50px;" >\n'
                html += '<a/>'
                html += '<div class="media-body">'
                html += '<h5 class="media-heading"><a href="#" rel="' + data[i] + '">  ' + data[i] + '</a></h5>'
                html += '</div>'
                html += ' </div>'



            }





        }
        $onlineUsers.html(html);


    });




    //tüm resimlere tıklanınca
    //  $('body').on('click','img',function(){ $( "#menu" ).menu());




    $sendMessageButton.click(function (e) {

        //prevent kullanım amacı sayfa yenilenmeden kullanılsın
        e.preventDefault();
        socket.emit('send message',$messageArea.val(),function(data){
            //üstteki satıra functionu callbak için ekledik
            //add stuff later
            $chatNew.append('<br><span class="error text-center center-block">' + data +"</span><br/>");



        });
        $messageArea.val('');

    });





    $('#groupPlace').on('click','.sendGroupMessage',function(e){

        e.preventDefault();
        var id=this.id.substr(0,1);

        //get group message
        var messageId="#"+id+"groupSendTextArea";
        var $message=$(messageId);
        var messageValue=$message.val();
        //var $message=$('body').find(messageId);



        //get groupName
        var groupId="#"+id+"groupName";
        var $group=$(groupId);
        var groupName=$group.text();


        var data=messageValue+" "+groupName;

        socket.emit('send group message',data,function(data){
            //üstteki satıra functionu callbak için ekledik
            //add stuff later

        });
        $message.val('');








        alert( messageValue+ groupName);










    });






    socket.on('load old msgs',function (docs) {
        for(var i=docs.length-1; i>=0 ; i--){
            displayMsg(docs[i]);

        }

    });

    //mesaj bize gelince yapılacaklar
    socket.on('new message',function (data) {
        displayMsg(data);

    });







    function displayMsg(data){
        if(data.username==username) {
            var message = '';
            message += '<div class="media msg">'
            message += '<a class="pull-left" href="#">'
            message += '<img class="media-object" src="https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" >\n'
            message += '</a>'
            message += '<div class="media-body">'
            message += '<h5 class="media-heading">' + data.username + '</h5>\n'
            //message+=' <small class="pull-right time"><i class="fa fa-clock-o"></i>'+data.updated_at+' </small>\n'
            message += ' <small class="col-lg-12">' + data.message + '</small>\n'
            message += '</div><br>'

            $chatNew.append(message);
        }
        else{

            var message = '';
            message += '<div class="media msg">'
            message += '<a class="pull-left" href="#">'
            message += '<img class="media-object" src="https://bootdey.com/img/Content/avatar/avatar1.png" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" >\n'
            message += '</a>'
            message += '<div class="media-body">'
            message += '<h5 class="media-heading">' + data.username + '</h5>\n'
            //message+=' <small class="pull-right time"><i class="fa fa-clock-o"></i>'+data.updated_at+' </small>\n'
            message += ' <small class="col-lg-12">' + data.message + '</small>\n'
            message += '</div><br>'

            $chatNew.append(message);



        }

    }

    socket.on('whisper',function(data){
        $chatNew.append('<span class="whisper"><b>'+data.username +':</b>'+data.message+"</span><br/>");

    });








});


