let mqtt = require('mqtt');
let ip = require('ip');
let request = require('request');
let client = mqtt.connect('ws://140.119.163.195:10000');
client.on('connect',function(err){
	client.subscribe('itriAddress/request',function(err){
		console.log(err);
	});
});
setInterval(()=>{
		//console.log(ip.address()+":alive")
		client.publish('itriAddress/alive',ip.address()+":alive");
},1000);
client.on('message',function(topic,msg){
	let data="";
	try{
		data=JSON.parse(msg.toString());
	}catch(e){}
	if(data.ip===ip.address()+":start"){
		console.log("start");
		try{
			request.post('http://127.0.0.1:3000/start',{form:{ idAddress:data.idAddress}},function(err,res,body){
				client.publish('itriAddress/response',body);
			});
		}catch(err){
			console.log(err);
		}
	}
	if(data.ip==ip.address()+":stop"){
		console.log("stop");
		try{
			request.post('http://127.0.0.1:3000/stop',{form:{ idAddress:data.idAddress}},function(err,res,body){
				client.publish('itriAddress/response',body);
			});

		}catch(err){
			console.log(err);
		}	
	}	
});
