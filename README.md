# 工研院計劃樹莓派部分安裝説明
## 使用以太坊私有鏈版本
*  Geth/v1.8.20-stable
*  go1.10.1
*  web3@0.20.6
*  使用環境Ubuntu/mac


## 安裝go
```shell=
wget https://dl.google.com/go/go1.10.1.linux-armv6l.tar.gz

sudo tar -C /usr/local -xzf go1.10.1.linux-armv6l.tar.gz

export PATH=$PATH:/usr/local/go/bin
```

## 安裝geth(Linux or MAC)

```shell=
mkdir src

cd src

sudo apt-get install -y git build-essential libgmp3-dev golang

git clone -b release/1.8 https://github.com/ethereum/go-ethereum.git

cd go-ethereum

make

sudo cp build/bin/geth /usr/local/bin/

```


## 安裝以太坊私有鏈環境
* 先確認安裝好go與go-ethereum
* 建立一個empty資料夾
```shell=
mkdir chain
cd chain
```
* 在資料夾中建立genesis.json
```
vim genesis.json

//輸入創世區塊内文
{
  "config": {
    "chainId": 33,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "ByzantiumBlock": 0 
  },
  "nonce": "0x0000000000000033",
  "timestamp": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x8000000",
  "difficulty": "0x1",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x3333333333333333333333333333333333333333",
  "alloc": {}
}

```

* 在終端機中安裝私有鏈資料
```shell=
geth --datadir ./data/ init genesis.json
```

* 在終端機中geth資料夾下，啓動私有鏈with web socket

```shell=
geth --datadir data --networkid 33 --ws --wsaddr "0.0.0.0" --wsapi "eth,web3,personal,debug,db,admin,miner,net,shh,txpool" --wsport 8546 --wsorigins "*" --rpc --rpcport 8545 --rpccorsdomain "*" --rpcapi " eth,web3,personal,debug,db,admin,miner,net,shh,txpool " --nodiscover console
```

## 樹莓派部分geth環境
1. 以同樣上述方式在樹莓派啓動區塊鏈geth環境
2. 連綫至伺服器聯盟鏈節點
在geth資料所在資料夾.chain/data/geth内新增`static-nodes.json`檔案，參考檔案内容如下（在主節點geth界面用`admin.nodeInfo.enode`查詢enode内容）
```shell=
cd ./chain/data/geth

vim static-nodes.json

//在檔案中輸入以下程式碼
[
//複製伺服器geth界面中的`admin.nodeInfo.enode`查詢結果
//IP位置也要改成連接聯盟鏈伺服器的IP
"enode://{...}@{IP}:30303?discport=0"
]
```


## 主合約部署步驟(伺服器部分)
1. 啓動終端機，到`BP-web/migrate`的資料夾下，啓動私有鏈（預設8545 port）
```shell=
git clone https://github.com/kimlin20011/Blockchain-logistic-project-backend.git
cd Blockchain-logistic-project-backend.git
npm start
```

## note
* 在此系統中，所有交易都使用`account[0]`送出

###### tags: `blockchain`
