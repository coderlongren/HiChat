var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];
    admin = ["赛龙", "雅克","刘备"]; // 管理员
// 静态路由
app.use('/', express.static(__dirname + '/www'));
// 绑定 3000端口
server.listen(3001);
//handle Socket
io.sockets.on('connection', function(socket) {
    //新用户登录
    socket.on('login', function(nickname) {
        console.log("建立了");
        if (users.indexOf(nickname) > -1) { // 此用户是否已登录
            socket.emit('nickExisted');
        } else {
            var flag = false;
            if (admin.indexOf(nickname) > -1) {
                flag = true;
                console.log(flag + "ddddddddddddddddddddd");
            }
            socket.nickname = nickname;
            console.log("SBBBBBB来了");
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login',flag);
        };
    });
    // 登出
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            if (admin.indexOf(socket.nickname) > -1) {
                users.splice(users.indexOf(socket.nickname), 1);
                socket.broadcast.emit('system', socket.nickname, users.length, 'logout',true);
            }
            else {
                users.splice(users.indexOf(socket.nickname), 1);
                socket.broadcast.emit('system', socket.nickname, users.length, 'logout', false);
            }
        }
    });
    // 服务器获得一条消息之后，随机广播这条消息
    socket.on('postMsg', function(msg, color) {
        if (admin.indexOf(socket.name) > -1) {
            socket.broadcast.emit('newMsg', "管理员" + socket.nickname, msg, color,true);
        }
        else {
            socket.broadcast.emit('newMsg', socket.nickname, msg, color,false);
        }
    });
    //获得一张图片之后 广播
    socket.on('ew', function(imgData, color) {
        if (admin.indexOf(socket.name) > -1) {
             socket.broadcast.emit('newImg', socket.nickname, imgData, color,true);
        }
        else {
             socket.broadcast.emit('newImg', socket.nickname, imgData, color,false);
        }
    });
});
