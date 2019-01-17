var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
let request= require('request');
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
let obj={};
let mission={};
let promise=new Promise(function(resolve){
	require('getmac').getMac({iface: 'wlan0'}, function(err, macAddress){
		obj.mac=macAddress;
		request.post('http://140.119.163.196:3000/registerDevice',{form:{mac:macAddress}});
		request.put('http://140.119.163.196:3000/resetDevice',{form:{mac:macAddress}});
		resolve(obj);
	});
});
promise.then(function(full){
	let deviceStatus=true;
	let flag=false;
	setInterval(function(){
		request.get(`http://140.119.163.196:3000/getAllMission?mac=${full.mac}`,function(err,httpResponse,body){
			let data=JSON.parse(body);
			if(data.status=="true" &&  deviceStatus==true){
				request.put('http://140.119.163.196:3000/startDevice',{form:{mac:full.mac,Contract_Address:data.Contract_Address}},function(err,httpResponse,body){});
				request.post('http://127.0.0.1:3000/start',{form:{ idAddress:data.Contract_Address}},function(err,res,body){
					if(err){
					}else{
						deviceStatus=false;
						flag=true;
					}
				});
			}else{
				if(data.status=="false" && flag){
					request.put('http://140.119.163.196:3000/stopDevice',{form:{mac:full.mac,Contract_Address:data.Contract_Address}},function(err,httpResponse,body){});
					request.post('http://127.0.0.1:3000/stop',{form:{ idAddress:data.Contract_Address}},function(err,res,body){
						if(err){
						}else{
							deviceStatus=true;
							flag=false;
						}
					});
				}			
			}
		});
	},1000);
})

setInterval(()=>{
	request.post('http://140.119.163.196:3000/registerDevice',{form:{mac:obj.mac}});
},120000);


module.exports = app;
