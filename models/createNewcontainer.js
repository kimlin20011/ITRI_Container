//put in the cloudserver
//與gui互動，能夠一鍵部署新合約
var Web3 = require("web3")
var web3 = new Web3
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
var http = require('http');
const mysql=require('mysql');

var abi =[{"constant":true,"inputs":[{"name":"containerID","type":"string"}],"name":"getNumberOfState","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"containerID","type":"string"}],"name":"createContainer","outputs":[{"name":"containerAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clearContainerNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"creatorAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"_containerNumber","type":"uint256"},{"indexed":false,"name":"_containerID","type":"string"}],"name":"containerCreated","type":"event"}];

// 合约地址
var address_main = "0x4ed0b48c96e2502998e70a7d6b1ed8dddc95ff86";
//主要要更改輸入id的部分
// 通过ABI和地址获取已部署的合约对象
var con = web3.eth.contract(abi).at(address_main);

var account_one = web3.eth.accounts[0];
// 提交交易到区块链，会立即返回交易hash，但是交易要等到被矿工收录到区块中后才生效
// var txhash = con.createContainer("test1", {from:account_one, gas:4300000});
// console.log(`hash: ${txhash}`);


// myEvent.watch(function(err, result) {
//     if (!err) {
// 		console.log(result.args);
//     } else {
//         console.log(err);
//     }
//   // myEvent.stopWatching();
// });


//Create new contract
//API use inputID
class CreateNew{
  create(req,res,next){

  	var myEvent = con.containerCreated();

  	    console.log(JSON.stringify(req.body));
		let inputID=req.body.inputID;
		console.log(`ID: ${inputID}`);

		let conn=mysql.createConnection({
			host:"127.0.0.1",
			user:"pi",
			password:"nccutest",
			database:"ITRIProject"
		});

		//listen to the 
	//	var myEvent = con.containerCreated();
		console.log("start watching")
		myEvent.watch(function(err, result) {
		    if (!err) {
		    	let _address = result.args._address;
		    	let _containerNumber = result.args._containerNumber;
		    	let _containerID = result.args._containerID;
				console.log(`Watching :: ID: ${_containerID}, address :${_address}, The total number of container :${_containerNumber}`);

		    	if(_containerID === inputID){
		    		console.log("ID correct")
		    		conn.connect(function(err){
						if(!err){
							let sql="INSERT INTO `IdMapContract`(`Id`,`Contract_Address`,`Number`) VALUES ('"+_containerID+"','"+_address+"','"+_containerNumber+"')";
							conn.query(sql,function(err,ressql){
								if(!err){
									res.send(JSON.stringify(`{ID: ${_containerID}, address :${_address}, totalnumber:${_containerNumber}}`));
									// console.log("ressql: "+ressql);
									// res.send(JSON.stringify(ressql));
									myEvent.stopWatching();
									console.log("stop watching")
								}	
								else{
									console.log(err);
									myEvent.stopWatching();
									console.log("stop watching")
								}
								conn.end();
							});
						}		
					});	
		    	}else{
		    		console.log("ID not correct")
		    	}
		    } 
		    // else {
		    //     console.log(err);
		    //     res.send(err);
		    // }
		});

		if (inputID!= undefined){
			//提交交易到区块链，会立即返回交易hash，生成新和合約
			let txhash = con.createContainer(inputID, {from:account_one, gas:4300000});
			console.log(`hash: ${txhash}`);
			//res.write(`hash: ${txhash}`);
		}

		
		return;
	}
}


module.exports = CreateNew;