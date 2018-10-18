//以api輸入物品address后可以取得名稱
var Web3 = require("web3")
var web3 = new Web3
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
var http = require('http');
var express = require('express');
const router = express.Router();

var abi =[{"constant":false,"inputs":[{"name":"state","type":"string"}],"name":"addState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clearDataOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPresentState","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_containerID","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"_index","type":"uint256"},{"indexed":false,"name":"_containerState","type":"string"}],"name":"stateUploadEvent","type":"event"}];

// 合约地址
//var address = "0x2c5d50beec247c21813861fa91e88040180e0907";

// 通过ABI和地址获取已部署的合约对象
//var con = web3.eth.contract(abi).at(address);
var account_one = web3.eth.accounts[0];
let count =0 ;
var clearInterval_id;

var myEvent;


class GetSensorTest{
    start(req,res,next){

        console.log(JSON.stringify(req.body));
        // let data=JSON.parse(req.body);
        // console.log(JSON.stringify(data));
        var address = req.body.idAddress;
        console.log(address);
        // get the contract by address
        var sensorContract = web3.eth.contract(abi).at(address);
        //var sensorContract = web3.eth.contract(abi, address);
        myEvent = sensorContract.stateUploadEvent();
        let count =0 ;

        myEvent.watch(function(err, result) {  //print index and state
            //console.log(result.args);
            console.log(result);

            //new
        });

        main(req,res,sensorContract);
        return;
        }

    stop(req,res,next){
        myEvent.stopWatching();
        clearInterval(clearInterval_id);
        console.log(`clearInterval and stop watching`);
        return;
    }
}


function main(req,res,con){
	clearInterval_id = setInterval(function(){
		// 提交交易到区块链，会立即返回交易hash，但是交易要等到被矿工收录到区块中后才生效
		count++; 
		var txhash = con.addState(`test${count}`, {from:account_one, gas:1000000});
        let id = con.containerID.call();
		console.log(`hash: ${txhash}`);
        console.log(`containerID: ${id}`);
       // res.write(data);
	},10000);
}

module.exports = GetSensorTest;