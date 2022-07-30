const serverSocket = require('ws').Server;
const express = require('express');
const screenshot = require('screenshot-desktop');
const cmd = require('child_process');

const web = express();

web.get('/link',(req,res)=>{
    console.log('yes')
    res.sendFile(__dirname+'/client/client.html');
})
const server = web.listen(80,()=>{console.log('listening')});

var loop;
const decoder = new TextDecoder();

const wss = new serverSocket({server})
wss.on('connection',ws=>{
    loop = setInterval(()=>screenshot({format:'jpg'}).then(png=>{
        ws.send(png);
    }),100);
    ws.on('close',()=>clearInterval(loop));
    ws.on('message',emsg=>{
        let msg = decoder.decode(emsg);
        let args = msg.split(' ');
        [()=>{
            cmd.exec('python MKController.py 0 '+args[1]+' '+args[2]);
        },
        ()=>cmd.exec('python MKController.py 1 '+args[1]),()=>cmd.exec('python MKController.py 2 '+args[1]),
        ()=>cmd.exec('python MKController.py 3 '+(args[1]||'space')),()=>cmd.exec('python MKController.py 4 '+(args[1]||'space'))][parseInt(args[0])]();
    });
})